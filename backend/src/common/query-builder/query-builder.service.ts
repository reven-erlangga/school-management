import { Injectable, Logger } from '@nestjs/common';
import { QueryParams } from './interfaces/query-params.interface';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { PaginationService } from './pagination/pagination.service';
import * as crypto from 'crypto';

@Injectable()
export class QueryBuilderService {
  private readonly logger = new Logger(QueryBuilderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly pagination: PaginationService,
  ) {}

  private queryParams: QueryParams = {};
  private modelName: string;
  private allowed_includes: string[] = [];
  private allowed_fields: string[] = [];
  private allowed_sorts: string[] = [];
  private allowed_filters: string[] = [];

  // Cache configuration
  private useCacheEnabled: boolean = false;
  private cacheTTL: number = 300; // 5 minutes default

  using(modelName: string, queryParams: QueryParams) {
    this.modelName = modelName;
    this.queryParams = queryParams;
    // Reset cache config on new usage
    this.useCacheEnabled = false;
    this.cacheTTL = 300;
    return this;
  }

  useCache(ttl: number = 300) {
    this.useCacheEnabled = true;
    this.cacheTTL = ttl;
    return this;
  }

  field(fields: string | string[]) {
    if (Array.isArray(fields)) {
      this.queryParams.fields = fields;
    } else {
      this.queryParams.fields = fields;
    }
    return this;
  }

  include(includes: string | string[]) {
    if (Array.isArray(includes)) {
      this.queryParams.includes = includes.join(',');
    } else {
      this.queryParams.includes = includes;
    }
    return this;
  }

  sort(sort: string | string[]) {
    if (Array.isArray(sort)) {
      this.queryParams.sort = sort.join(',');
    } else {
      this.queryParams.sort = sort;
    }
    return this;
  }

  filter(where: Record<string, any>) {
    this.queryParams.filter = {
      ...(this.queryParams.filter || {}),
      ...(where || {}),
    };
    return this;
  }

  allowedIncludes(includes: string[]) {
    this.allowed_includes = includes;
    return this;
  }

  allowedFields(fields: string[]) {
    this.allowed_fields = fields;
    return this;
  }

  allowedSorts(sorts: string[]) {
    this.allowed_sorts = sorts;
    return this;
  }

  allowedFilters(filters: string[]) {
    this.allowed_filters = filters;
    return this;
  }

  build() {
    const prismaQuery: any = {
      where: {},
      include: {},
      orderBy: {},
      select: undefined,
      take: undefined,
      skip: undefined,
      cursor: undefined,
    };

    // Build filters (where)
    const filters = this.queryParams.filter;
    if (filters) {
      Object.keys(filters).forEach((key) => {
        if (this.allowed_filters.includes(key)) {
          const value = filters[key];
          // Simple equality for now, can be expanded to support GT, LT, etc.
          prismaQuery.where[key] = value;
        }
      });
    }

    // Build pagination
    if (this.queryParams.limit) {
      prismaQuery.take = Number(this.queryParams.limit);
    }

    if (this.queryParams.cursor) {
      prismaQuery.cursor = { id: this.queryParams.cursor };
      prismaQuery.skip = 1; // Skip the cursor itself
    } else if (this.queryParams.page && this.queryParams.limit) {
      // Offset pagination fallback
      prismaQuery.skip =
        (Number(this.queryParams.page) - 1) * Number(this.queryParams.limit);
    }

    // Build includes (relations)
    const requestedIncludesString = this.queryParams.includes;
    if (
      requestedIncludesString &&
      typeof requestedIncludesString === 'string'
    ) {
      const requestedIncludes = requestedIncludesString.split(',');
      requestedIncludes.forEach((include) => {
        if (this.allowed_includes.includes(include)) {
          // Handle nested includes like 'state.country'
          const parts = include.split('.');
          let current = prismaQuery.include;
          parts.forEach((part, index) => {
            if (!current[part]) {
              current[part] =
                index === parts.length - 1 ? true : { include: {} };
            }
            if (index < parts.length - 1) {
              current = current[part].include;
            }
          });
        }
      });
    }

    // Build sorts (orderBy)
    const sortString = this.queryParams.sort;
    if (sortString && typeof sortString === 'string') {
      const sortFields = sortString.split(',');
      sortFields.forEach((field) => {
        let direction = 'asc';
        let fieldName = field;
        if (field.startsWith('-')) {
          direction = 'desc';
          fieldName = field.substring(1);
        }
        if (this.allowed_sorts.includes(fieldName)) {
          prismaQuery.orderBy[fieldName] = direction;
        }
      });
    }

    // Build fields (select)
    const requestedFields = this.queryParams.fields;
    if (requestedFields) {
      let fields: string[] = [];
      if (typeof requestedFields === 'string') {
        fields = requestedFields.split(',');
      } else if (Array.isArray(requestedFields)) {
        fields = requestedFields;
      }

      if (fields.length > 0) {
        prismaQuery.select = {};
        fields.forEach((field) => {
          if (this.allowed_fields.includes(field)) {
            prismaQuery.select[field] = true;
          }
        });
      }
    }

    // Clean up empty objects
    if (Object.keys(prismaQuery.include).length === 0)
      delete prismaQuery.include;
    if (Object.keys(prismaQuery.orderBy).length === 0)
      delete prismaQuery.orderBy;
    if (Object.keys(prismaQuery.where).length === 0) delete prismaQuery.where;

    return prismaQuery;
  }

  private generateCacheKey(): string {
    const model = this.modelName.toLowerCase();
    const page = this.queryParams.page || 1;
    const limit = this.queryParams.limit || 10;

    // Create a hash of filter and sort
    const filter = JSON.stringify(this.queryParams.filter || {});
    const sort = this.queryParams.sort || '';
    const includes = this.queryParams.includes || '';
    const fields = this.queryParams.fields || '';

    const hashContent = `${filter}|${sort}|${includes}|${fields}`;
    const hash = crypto
      .createHash('sha256')
      .update(hashContent)
      .digest('hex')
      .substring(0, 16);

    // Key format: {model}:paginate:{page}:{limit}:{hash}
    return `${model}:paginate:${page}:${limit}:${hash}`;
  }

  async execute() {
    if (!this.modelName) {
      throw new Error('Model name is not set. Use using() method.');
    }

    // Check if model exists in prisma
    if (!this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }

    if (this.useCacheEnabled) {
      const cacheKey = this.generateCacheKey();
      const cachedResult = await this.redisService.get(cacheKey);

      if (cachedResult) {
        this.logger.debug(`Cache HIT for key: ${cacheKey}`);
        return cachedResult;
      }

      this.logger.debug(`Cache MISS for key: ${cacheKey}`);
      const query = this.build();
      const result = await this.prisma[this.modelName].findMany(query);

      await this.redisService.set(cacheKey, result, this.cacheTTL);
      return result;
    }

    const query = this.build();
    return this.prisma[this.modelName].findMany(query);
  }

  async paginate(page: number = 1, limit: number = 10) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    const prismaQuery = this.build();
    return this.pagination.paginate(
      this.prisma[this.modelName],
      prismaQuery,
      page,
      limit,
    );
  }

  async cursorPaginate(limit: number = 20, cursor?: string) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    const prismaQuery = this.build();
    return this.pagination.cursorPaginate(
      this.prisma[this.modelName],
      prismaQuery,
      limit,
      cursor,
    );
  }

  async count() {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }

    const query = this.build();

    if (this.useCacheEnabled) {
      // Use a different key prefix for count
      const cacheKey = this.generateCacheKey().replace(':paginate:', ':count:');
      const cachedResult = await this.redisService.get(cacheKey);

      if (cachedResult !== null) {
        // Count can be 0, so check strict null
        this.logger.debug(`Cache HIT for key: ${cacheKey}`);
        return cachedResult;
      }

      const result = await this.prisma[this.modelName].count({
        where: query.where,
      });
      await this.redisService.set(cacheKey, result, this.cacheTTL);
      return result;
    }

    return this.prisma[this.modelName].count({ where: query.where });
  }

  async update(id: string, data: any) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    // No cache for update, handled by invalidation middleware
    return this.prisma[this.modelName].update({ where: { id }, data });
  }

  async create(data: any) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    const query = this.build();
    return this.prisma[this.modelName].create({
      data,
      ...(query.select ? { select: query.select } : {}),
    });
  }

  async delete(whereOrId: any) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    if (typeof whereOrId === 'string') {
      return this.prisma[this.modelName].delete({ where: { id: whereOrId } });
    }
    return this.prisma[this.modelName].deleteMany({ where: whereOrId || {} });
  }

  async upsert(where: Record<string, any>, data: any) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    const query = this.build();
    return this.prisma[this.modelName].upsert({
      where,
      create: data,
      update: data,
      ...(query.select ? { select: query.select } : {}),
    });
  }

  async updateMany(data: any) {
    const query = this.build();
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    return this.prisma[this.modelName].updateMany({ where: query.where, data });
  }

  async findById(id: string) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }

    const query = this.build();
    const { include, select } = query;

    return this.prisma[this.modelName].findUnique({
      where: { id },
      ...(include ? { include } : {}),
      ...(select ? { select } : {}),
    });
  }

  async findOne(where: Record<string, any>) {
    if (!this.modelName || !this.prisma[this.modelName]) {
      throw new Error(
        `Model ${this.modelName} does not exist in PrismaService.`,
      );
    }
    const query = this.build();
    const { include, select } = query;
    return this.prisma[this.modelName].findUnique({
      where,
      ...(include ? { include } : {}),
      ...(select ? { select } : {}),
    });
  }
}

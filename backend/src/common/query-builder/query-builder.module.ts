import { Module } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { PaginationService } from './pagination/pagination.service';
import { QueryBuilder } from './QueryBuilder';

@Module({
  providers: [QueryBuilderService, PaginationService, QueryBuilder],
  exports: [QueryBuilderService, PaginationService, QueryBuilder],
})
export class QueryBuilderModule {}

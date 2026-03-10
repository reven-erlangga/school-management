import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { QueryParams } from '../interfaces/query-params.interface';

@Injectable()
export class FieldService {
  apply<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: QueryParams,
    fields: string[],
  ): void {
    this.normalizeFields(query);

    const mainAlias = queryBuilder.alias;
    const rawFields = query.fields;
    const fieldsMap: Record<string, Set<string>> = {};

    // Helper to add fields to map
    const addFields = (alias: string, fieldsStr: string) => {
      if (!fieldsMap[alias]) fieldsMap[alias] = new Set();
      fieldsStr.split(',').forEach((f) => {
        const trimmed = f.trim();
        if (trimmed) {
          fieldsMap[alias].add(trimmed);
        }
      });
    };

    // Normalize fields parameter
    if (rawFields) {
      const toCamelAlias = (value: string) =>
        value.replace(/_([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());

      const handleField = (key: string | number, value: any) => {
        const isNumeric = !isNaN(Number(key));

        if (typeof value === 'string') {
          if (isNumeric || String(key) === 'default') {
            // fields[0]=name, fields[]=name or fields[default]=name -> mainAlias
            addFields(mainAlias, value);
          } else {
            // fields[country]=name -> country alias
            addFields(toCamelAlias(String(key)), value);
          }
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects (e.g. mixed array/object parsing)
          Object.keys(value as object).forEach((subKey) => {
            handleField(subKey, (value as Record<string, any>)[subKey]);
          });
        }
      };

      if (typeof rawFields === 'string') {
        addFields(mainAlias, rawFields);
      } else if (Array.isArray(rawFields)) {
        rawFields.forEach((item, index) => handleField(index, item));
      } else if (typeof rawFields === 'object') {
        Object.keys(rawFields).forEach((key) => {
          handleField(key, rawFields[key]);
        });
      }
    }

    let selection: string[] = [];

    if (fieldsMap[mainAlias] && fieldsMap[mainAlias].size > 0) {
      const nested: string[] = [];
      fieldsMap[mainAlias].forEach((field) => {
        if (field.includes('.')) {
          nested.push(field);
        }
      });

      const toCamelPath = (path: string) =>
        path
          .split('.')
          .map((part) =>
            part.replace(/_([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase()),
          )
          .join('.');

      nested.forEach((fieldPath) => {
        fieldsMap[mainAlias].delete(fieldPath);
        const parts = fieldPath.split('.');
        const fieldName = parts.pop() as string;
        const relationPath = parts.join('.');
        if (!relationPath) {
          return;
        }
        const camelPath = toCamelPath(relationPath);
        const aliasName = camelPath.split('.').pop() as string;
        if (!fieldsMap[aliasName]) {
          fieldsMap[aliasName] = new Set();
        }
        fieldsMap[aliasName].add(fieldName);
      });

      if (fieldsMap[mainAlias].size === 0) {
        delete fieldsMap[mainAlias];
      }
    }

    // 1. Handle Main Entity Fields
    let mainFields = fields; // Default: allow all fields

    // If we have explicit fields for main alias in our map
    if (fieldsMap[mainAlias] && fieldsMap[mainAlias].size > 0) {
      // Filter requested fields against allowed fields
      mainFields = Array.from(fieldsMap[mainAlias]).filter((f) =>
        fields.includes(f),
      );
    }

    // Only select allowed fields for main entity
    if (mainFields.length > 0) {
      // Always include ID for main entity to ensure pagination and distinct queries work correctly
      if (!mainFields.includes('id')) {
        mainFields.push('id');
      }
      selection = mainFields.map((f) => `${mainAlias}.${f}`);
    }

    // 2. Handle Joined Relations Fields
    // Get all joined aliases from TypeORM metadata
    const joinedAliases = queryBuilder.expressionMap.aliases
      .map((a) => a.name)
      .filter((a) => a !== mainAlias);

    joinedAliases.forEach((alias) => {
      // If fields[alias] is specified, pick only those
      if (fieldsMap[alias] && fieldsMap[alias].size > 0) {
        // Ensure the relation is still hydrated as an object on the entity
        selection.push(alias);
        const requested = Array.from(fieldsMap[alias]);
        requested.forEach((f) => {
          // We don't validate relation fields against a whitelist here
          selection.push(`${alias}.${f}`);
        });
      } else {
        // If NO fields specified for this relation, select ALL (default behavior)
        selection.push(alias);
      }
    });

    if (selection.length > 0) {
      queryBuilder.select(selection);
    }
  }

  private normalizeFields(query: QueryParams): void {
    const extra: Record<string, any> = {};

    Object.keys(query).forEach((key) => {
      const match = key.match(/^fields\[(.*?)\]$/);
      if (match) {
        extra[match[1]] = query[key];
      }
    });

    if (Object.keys(extra).length === 0) {
      return;
    }

    if (!query.fields) {
      query.fields = extra;
      return;
    }

    if (typeof query.fields === 'object' && !Array.isArray(query.fields)) {
      query.fields = {
        ...(query.fields as Record<string, any>),
        ...extra,
      };
      return;
    }

    query.fields = {
      default: query.fields,
      ...extra,
    } as any;
  }
}

import { Module } from '@nestjs/common';
import { QueryBuilderService } from './query-builder.service';
import { PaginationService } from './pagination/pagination.service';
import { FindOneService } from './find-one/find-one.service';
import { DeleteService } from './delete/delete.service';

@Module({
  providers: [
    QueryBuilderService,
    PaginationService,
    FindOneService,
    DeleteService,
  ],
  exports: [
    QueryBuilderService,
    PaginationService,
    FindOneService,
    DeleteService,
  ],
})
export class QueryBuilderModule {}

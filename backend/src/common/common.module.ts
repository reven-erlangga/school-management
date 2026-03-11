import { Module, Global } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { AssetModule } from './asset/asset.module';
import { RedisModule } from './redis/redis.module';
import { MinioModule } from './minio/minio.module';
import { SeederModule } from './seeder/seeder.module';
import { VaultModule } from './vault/vault.module';
import { GenerateService } from './utils/generate.service';
import { UtilsModule } from './utils/utils.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    QueryBuilderModule,
    AssetModule,
    RedisModule,
    MinioModule,
    SeederModule,
    VaultModule,
    UtilsModule,
  ],
  exports: [
    PrismaModule,
    QueryBuilderModule,
    RedisModule,
    MinioModule,
    VaultModule,
  ],
  providers: [GenerateService],
})
export class CommonModule {}

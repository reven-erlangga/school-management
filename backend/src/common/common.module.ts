import { Module, Global } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { QueryBuilderModule } from './query-builder/query-builder.module';
import { AssetModule } from './asset/asset.module';
import { RedisModule } from './redis/redis.module';
import { MinioModule } from './minio/minio.module';
import { SeederModule } from './seeder/seeder.module';
import { VaultModule } from './vault/vault.module';

@Global()
@Module({
  imports: [PrismaModule, QueryBuilderModule, AssetModule, RedisModule, MinioModule, SeederModule, VaultModule],
  exports: [PrismaModule, QueryBuilderModule, RedisModule, MinioModule, VaultModule],
})
export class CommonModule { }

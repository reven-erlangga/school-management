import { Module, forwardRef } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { CommonModule } from '../common/common.module';
import { InitializeModule } from '../initialize/initialize.module';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';
import { QueryBuilderModule } from '../common/query-builder/query-builder.module';
import { VaultModule } from '../common/vault/vault.module';

@Module({
  imports: [InitializeModule, QueryBuilderModule, forwardRef(() => VaultModule)],
  controllers: [SettingController, UploadController],
  providers: [SettingService, UploadService],
  exports: [SettingService],
})
export class SettingModule {}

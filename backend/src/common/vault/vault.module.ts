import { Module, forwardRef } from '@nestjs/common';
import { VaultService } from './vault.service';
import { SettingModule } from '../../setting/setting.module';

@Module({
  imports: [forwardRef(() => SettingModule)],
  providers: [VaultService],
  exports: [VaultService],
})
export class VaultModule {}

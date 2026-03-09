import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationController } from './translation.controller';
import { SettingModule } from '../setting/setting.module';
import { VaultModule } from '../common/vault/vault.module';

@Module({
  imports: [SettingModule, VaultModule],
  controllers: [TranslationController],
  providers: [TranslationService],
})
export class TranslationModule {}

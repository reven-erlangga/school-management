import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { InitializationMiddleware } from './common/middleware/initialization.middleware';
import { InitializeService } from './initialize/initialize.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemographicsController } from './app.demographics.controller';
import { DemographicsService } from './app.demographics.service';
import { RbacModule } from './rbac/rbac.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { InstituteModule } from './institute/institute.module';
import { UnitModule } from './unit/unit.module';
import { StreamModule } from './stream/stream.module';
import { SettingModule } from './setting/setting.module';
import { UploadModule } from './upload/upload.module';
import { FinanceModule } from './finance/finance.module';
import { UserModule } from './user/user.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ArticleModule } from './article/article.module';
import { GenderModule } from './gender/gender.module';
import { EthnicityModule } from './ethnicity/ethnicity.module';
import { ReligionModule } from './religion/religion.module';
import { TransactionModule } from './transaction/transaction.module';
import { BannerModule } from './banner/banner.module';
import { TranslationController } from './translation/translation.controller';
import { TranslationService } from './translation/translation.service';
import { ProfileModule } from './profile/profile.module';
import { CaslModule } from './common/casl/casl.module';
import { InitializeModule } from './initialize/initialize.module';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CaslModule,
    CommonModule,
    RbacModule,
    AuthModule,
    InstituteModule,
    UnitModule,
    StreamModule,
    SettingModule,
    UploadModule,
    FinanceModule,
    UserModule,
    MonitoringModule,
    ArticleModule,
    GenderModule,
    EthnicityModule,
    ReligionModule,
    TransactionModule,
    BannerModule,
    ProfileModule,
    InitializeModule,
    CountryModule,
  ],
  controllers: [AppController, DemographicsController, TranslationController],
  providers: [AppService, DemographicsService, TranslationService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InitializationMiddleware)
      .exclude(
        { path: 'seeder/(.*)', method: RequestMethod.ALL },
        { path: 'initialize/(.*)', method: RequestMethod.ALL },
        { path: 'initialize', method: RequestMethod.ALL },
        { path: 'docs/(.*)', method: RequestMethod.ALL },
        { path: 'settings/(.*)', method: RequestMethod.ALL },
        { path: 'settings', method: RequestMethod.ALL },
        { path: 'api/health', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}

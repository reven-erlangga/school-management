import { Module } from '@nestjs/common';
import { RBAcModule } from 'nestjs-rbac';
import { RbacService } from './services/rbac.service';
import { RbacSeederService } from './services/rbac-seeder.service';
import { RbacController } from './controllers/rbac.controller';
import { RbacStorageService } from './services/rbac-storage.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    CommonModule,
    RBAcModule.forDynamic(RbacStorageService),
  ],
  providers: [RbacService, RbacStorageService, RbacSeederService],
  controllers: [RbacController],
  exports: [RbacService, RBAcModule, RbacSeederService],
})
export class RbacModule {}

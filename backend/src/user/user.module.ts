import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from '../common/common.module';
import { CaslModule } from '../common/casl/casl.module';
import { SuperUserController } from './super-user/super-user.controller';
import { SuperUserService } from './super-user/super-user.service';

@Module({
  imports: [CommonModule, CaslModule],
  controllers: [UserController, SuperUserController],
  providers: [UserService, SuperUserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { EnrollmentController } from './enrollment/enrollment.controller';
import { AttendanceController } from './attendance/attendance.controller';
import { FinanceController } from './finance/finance.controller';
import { GradingController } from './grading/grading.controller';
import { ShowcaseController } from './showcase/showcase.controller';
import { ShowcaseService } from './showcase/showcase.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [
    EnrollmentController,
    AttendanceController,
    FinanceController,
    GradingController,
    ShowcaseController,
  ],
  providers: [ShowcaseService],
})
export class MonitoringModule {}

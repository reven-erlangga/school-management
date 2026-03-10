import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institute.controller';
import { TeacherController } from './teacher/teacher.controller';
import { StudentController } from './student/student.controller';
import { StaffController } from './staff/staff.controller';
import { TeacherService } from './teacher/teacher.service';
import { StudentService } from './student/student.service';
import { StaffService } from './staff/staff.service';

@Module({
  controllers: [
    InstituteController,
    TeacherController,
    StudentController,
    StaffController,
  ],
  providers: [InstituteService, TeacherService, StudentService, StaffService],
  exports: [InstituteService, TeacherService, StudentService, StaffService],
})
export class InstituteModule {}

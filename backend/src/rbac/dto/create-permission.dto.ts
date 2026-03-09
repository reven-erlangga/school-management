import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'teacher.create' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Can create teacher record' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'uuid-of-module' })
  @IsNotEmpty()
  @IsUUID()
  module_id: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'teacher' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'teachers' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Teacher management module', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'management', required: true })
  @IsNotEmpty()
  @IsString()
  group: string;

  @ApiProperty({ example: 'default' })
  @IsNotEmpty()
  @IsString()
  page: string;

  @ApiProperty({ example: '/teachers', required: true })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({ example: 'grad', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  meta?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  config?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  endpoints?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  forms?: string;
}

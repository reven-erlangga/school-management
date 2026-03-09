import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Administrator with partial access' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'management', required: false })
  @IsOptional()
  @IsString()
  group?: string;

  @ApiProperty({ example: ['uuid1', 'uuid2'], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  permission_ids?: string[];
}

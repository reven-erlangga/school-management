import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReligionDto {
  @ApiProperty({ example: 'islam', description: 'Unique key for religion' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Islam', description: 'Name of the religion' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Islam religion', description: 'Description of the religion', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

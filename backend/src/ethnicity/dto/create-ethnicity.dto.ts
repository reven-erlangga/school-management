import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEthnicityDto {
  @ApiProperty({ example: 'javanese', description: 'Unique key for ethnicity' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ example: 'Javanese', description: 'Name of the ethnicity' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'People from Java island',
    description: 'Description of the ethnicity',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

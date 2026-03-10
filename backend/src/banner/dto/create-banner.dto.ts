import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BannerType {
  GENERAL = 'GENERAL',
  INSTITUTE = 'INSTITUTE',
}

export class CreateBannerDto {
  @ApiProperty({ enum: BannerType, example: 'GENERAL' })
  @IsEnum(BannerType)
  @IsNotEmpty()
  type: BannerType;

  @ApiProperty({ example: 'Summer Sale', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: { url: 'https://...', alt: 'banner' },
    description: 'JSON metadata for image',
  })
  @IsNotEmpty()
  image: any;

  @ApiProperty({ example: 'https://...', required: false })
  @IsString()
  @IsOptional()
  target_url?: string;

  @ApiProperty({ example: '2024-06-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  start_date?: string;

  @ApiProperty({ example: '2024-08-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  end_date?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: ['inst-id-1', 'inst-id-2'],
    required: false,
    description: 'List of institute IDs if type is INSTITUTE',
  })
  @IsArray()
  @IsOptional()
  institute_ids?: string[];
}

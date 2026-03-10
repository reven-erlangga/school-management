import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class StateFindAllQueryDto {
  @ApiProperty({
    description: 'Country ISO3 code (e.g. IDN)',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  @Transform(({ value }) => String(value).toUpperCase())
  iso3!: string;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsString()
  includes?: string;

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;
}

export class StateDropdownQueryDto {
  @ApiProperty({
    description: 'Country ISO3 code (e.g. IDN)',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  @Transform(({ value }) => String(value).toUpperCase())
  iso3!: string;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

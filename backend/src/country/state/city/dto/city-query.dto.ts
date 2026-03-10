import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CityFindAllQueryDto {
  @ApiProperty({ description: 'State code (state_code) to filter cities by' })
  @IsString()
  @Transform(({ value }) => String(value))
  state_code!: string;

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

export class CityDropdownQueryDto {
  @ApiProperty({ description: 'State code (state_code) to filter cities by' })
  @IsString()
  @Transform(({ value }) => String(value))
  state_code!: string;

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

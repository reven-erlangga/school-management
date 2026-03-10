import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CountryFindAllQueryDto {
  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Comma-separated fields. Prefix with - for desc (e.g. name,-iso3)',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated includes (e.g. states,states.cities)',
  })
  @IsOptional()
  @IsString()
  includes?: string;

  @ApiPropertyOptional({
    description: 'Comma-separated selected fields (e.g. id,name,iso3)',
  })
  @IsOptional()
  @IsString()
  fields?: string;

  @ApiPropertyOptional({
    description: 'Filter object. Example: filter[iso3]=IDN&filter[region]=Asia',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  filter?: Record<string, any>;
}

export class CountryDropdownQueryDto {
  @ApiPropertyOptional({ type: Number, default: 20 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Cursor (country id) from previous response meta.next_cursor',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({ description: 'Search by country name' })
  @IsOptional()
  @IsString()
  search?: string;
}

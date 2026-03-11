import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationJsonDto {
  @ApiProperty({ example: 'Islam' })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({ example: 'Islam' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateReligionDto {
  @ApiProperty({ example: 'islam', description: 'Unique key for religion' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    example: { en: 'Islam', id: 'Islam' },
    description: 'Name translation JSON',
  })
  @ValidateNested()
  @Type(() => TranslationJsonDto)
  @IsNotEmpty()
  name: TranslationJsonDto;

  @ApiProperty({
    example: { en: 'Islamic Faith', id: 'Agama Islam' },
    description: 'Description translation JSON',
    required: false,
  })
  @ValidateNested()
  @Type(() => TranslationJsonDto)
  @IsOptional()
  description?: TranslationJsonDto;

  @ApiProperty({ example: true, description: 'Active status', required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

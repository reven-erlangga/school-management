import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslationDto {
  @ApiProperty({ example: 'Male', description: 'English translation' })
  @IsString()
  @IsNotEmpty()
  en: string;

  @ApiProperty({ example: 'Pria', description: 'Indonesian translation' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class CreateGenderDto {
  @ApiProperty({ example: 'male', description: 'Unique key for gender' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ type: TranslationDto, description: 'Localized name' })
  @IsObject()
  @IsNotEmpty()
  name: TranslationDto;

  @ApiProperty({
    type: TranslationDto,
    description: 'Localized description',
    required: false,
  })
  @IsObject()
  @IsOptional()
  description?: TranslationDto;
}

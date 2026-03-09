import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateStreamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  institute_id: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateStreamDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

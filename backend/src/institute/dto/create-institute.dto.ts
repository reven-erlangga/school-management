import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class CreateInstituteDto {
  // Step 1: General
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  type?: string;

  // Step 2: Contact
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  fax?: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  // Step 3: Account
  @IsEnum(['existing', 'new'])
  @IsNotEmpty()
  accountType: 'existing' | 'new';

  @ValidateIf((o) => o.accountType === 'existing')
  @IsString()
  @IsNotEmpty()
  existingAdminId?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsNotEmpty()
  adminFullName?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsNotEmpty()
  adminEmail?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsNotEmpty()
  adminPhone?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsOptional()
  ethnicity?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsOptional()
  religion?: string;

  @ValidateIf((o) => o.accountType === 'new')
  @IsString()
  @IsOptional()
  identityNumber?: string;
}

export class UpdateInstituteDto extends CreateInstituteDto {}

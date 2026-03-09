import { ApiProperty } from '@nestjs/swagger';

export class SettingEntity {
  @ApiProperty({
    description: 'Setting group (e.g., general, mail, tolgee)',
    example: 'general',
  })
  group: string;

  @ApiProperty({
    description: 'Setting key',
    example: 'site_name',
  })
  key: string;

  @ApiProperty({
    description: 'Setting value',
    example: 'School Management System',
  })
  value: string;

  @ApiProperty({
    description: 'Whether the setting value is sensitive',
    example: false,
  })
  is_sensitive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  updated_at: Date;

  constructor(partial: Partial<SettingEntity>) {
    Object.assign(this, partial);
  }
}

export class InitializationStatusEntity {
  @ApiProperty({
    description: 'Whether general settings are configured',
    example: true,
  })
  general: boolean;

  @ApiProperty({
    description: 'Whether mail settings are configured',
    example: true,
  })
  mail: boolean;

  @ApiProperty({
    description: 'Whether tolgee settings are configured',
    example: false,
  })
  tolgee: boolean;

  @ApiProperty({
    description: 'Overall initialization status',
    example: false,
  })
  is_initialized: boolean;

  constructor(partial: Partial<InitializationStatusEntity>) {
    Object.assign(this, partial);
  }
}

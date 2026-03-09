import { ApiProperty } from '@nestjs/swagger';

export class ModuleEntity {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  group!: string;

  @ApiProperty({ required: false })
  icon?: string;

  @ApiProperty()
  page!: string;

  @ApiProperty({ required: false })
  meta?: string;

  @ApiProperty({ required: false })
  config?: string;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}

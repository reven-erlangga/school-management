import { Controller, Get } from '@nestjs/common';
import { ShowcaseService } from './showcase.service';

@Controller('monitoring/showcase')
export class ShowcaseController {
  constructor(private readonly showcaseService: ShowcaseService) {}

  @Get()
  getShowcase() {
    return this.showcaseService.getShowcaseData();
  }
}

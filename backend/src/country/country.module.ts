import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { StateService } from './state/state.service';
import { StateController } from './state/state.controller';
import { CityController } from './state/city/city.controller';
import { CityService } from './state/city/city.service';

@Module({
  controllers: [CountryController, StateController, CityController],
  providers: [CountryService, StateService, CityService],
})
export class CountryModule {}

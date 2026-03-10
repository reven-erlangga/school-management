import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class GeographicalService {
  private readonly logger = new Logger(GeographicalService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed(
    onProgress?: (progress: number, message: string) => Promise<void>,
  ) {
    const filePath = path.resolve(process.cwd(), 'assets', 'geographical.json');
    let fileContent: string;
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Failed to read geographical.json: ${error.message}`);
      throw error;
    }

    const countries = JSON.parse(fileContent);
    const totalCountries = countries.length;

    this.logger.log(
      `Seeding geographical data... Found ${totalCountries} countries.`,
    );

    if (onProgress) {
      await onProgress(0, 'seeding country');
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    let processedCountries = 0;
    let createdCountries = 0;
    let updatedCountries = 0;
    let seededStates = 0;
    let seededCities = 0;

    for (let i = 0; i < totalCountries; i++) {
      const countryData = countries[i];

      const existingCountry = await (this.prisma as any).country.findFirst({
        where: { iso3: countryData.iso3 },
      });

      const countryId = existingCountry?.id;

      const country = existingCountry
        ? await (this.prisma as any).country.update({
            where: { id: countryId },
            data: {
              name: countryData.name,
              iso3: countryData.iso3,
              iso2: countryData.iso2,
              phone_code: countryData.phone_code,
              capital: countryData.capital,
              currency: countryData.currency,
              currency_symbol: countryData.currency_symbol,
              tld: countryData.tld,
              native: countryData.native,
              region: countryData.region,
              subregion: countryData.subregion,
              timezones: countryData.timezones ?? [],
              translations: countryData.translations ?? {},
              latitude: countryData.latitude,
              longitude: countryData.longitude,
              emoji: countryData.emoji,
              emojiU: countryData.emojiU,
            },
          })
        : await (this.prisma as any).country.create({
            data: {
              name: countryData.name,
              iso3: countryData.iso3,
              iso2: countryData.iso2,
              phone_code: countryData.phone_code,
              capital: countryData.capital,
              currency: countryData.currency,
              currency_symbol: countryData.currency_symbol,
              tld: countryData.tld,
              native: countryData.native,
              region: countryData.region,
              subregion: countryData.subregion,
              timezones: countryData.timezones ?? [],
              translations: countryData.translations ?? {},
              latitude: countryData.latitude,
              longitude: countryData.longitude,
              emoji: countryData.emoji,
              emojiU: countryData.emojiU,
            },
          });

      if (existingCountry) {
        updatedCountries++;
      } else {
        createdCountries++;
      }

      processedCountries++;

      await (this.prisma as any).state.deleteMany({
        where: {
          country_id: country.id,
        },
      });

      if (countryData.states && countryData.states.length > 0) {
        for (const stateData of countryData.states) {
          const state = await (this.prisma as any).state.create({
            data: {
              name: stateData.name,
              state_code: stateData.state_code,
              latitude: stateData.latitude,
              longitude: stateData.longitude,
              country_id: country.id,
            },
          });
          seededStates++;

          if (stateData.cities && stateData.cities.length > 0) {
            await (this.prisma as any).city.createMany({
              data: stateData.cities.map((cityData: any) => ({
                name: cityData.name,
                latitude: cityData.latitude,
                longitude: cityData.longitude,
                state_id: state.id,
              })),
            });
            seededCities += stateData.cities.length;
          }
        }
      }

      if (onProgress) {
        const progress = Math.round(((i + 1) / totalCountries) * 100);
        await onProgress(progress, 'seeding country');
      }
    }

    const summary = `Geographical data seeded successfully. Countries processed: ${processedCountries} (created: ${createdCountries}, updated: ${updatedCountries}), states: ${seededStates}, cities: ${seededCities}`;
    this.logger.log(summary);
    if (onProgress) {
      await onProgress(100, summary);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }
}

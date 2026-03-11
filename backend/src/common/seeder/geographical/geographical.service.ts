import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

type GeographicalCity = {
  name: string;
  latitude?: string | null;
  longitude?: string | null;
};

type GeographicalState = {
  name: string;
  state_code?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  cities?: GeographicalCity[] | null;
};

type GeographicalCountry = {
  name: string;
  iso3: string;
  iso2: string;
  phone_code?: string | null;
  capital?: string | null;
  currency?: string | null;
  currency_symbol?: string | null;
  tld?: string | null;
  native?: string | null;
  region?: string | null;
  subregion?: string | null;
  timezones?: unknown;
  translations?: unknown;
  latitude?: string | null;
  longitude?: string | null;
  emoji?: string | null;
  emojiU?: string | null;
  states?: GeographicalState[] | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isString = (value: unknown): value is string => typeof value === 'string';

const parseCountries = (value: unknown): GeographicalCountry[] => {
  if (!Array.isArray(value)) return [];
  const out: GeographicalCountry[] = [];

  for (const item of value) {
    if (!isRecord(item)) continue;
    if (!isString(item.name) || !isString(item.iso3) || !isString(item.iso2)) {
      continue;
    }

    out.push(item as unknown as GeographicalCountry);
  }

  return out;
};

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to read geographical.json: ${message}`);
      throw error;
    }

    const countries = parseCountries(JSON.parse(fileContent) as unknown);
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

      const existingCountry = await this.prisma.country.findFirst({
        where: { iso3: countryData.iso3 },
      });

      const country = existingCountry
        ? await this.prisma.country.update({
            where: { id: existingCountry.id },
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
              timezones: (countryData.timezones ?? []) as Prisma.InputJsonValue,
              translations: (countryData.translations ??
                {}) as Prisma.InputJsonValue,
              latitude: countryData.latitude,
              longitude: countryData.longitude,
              emoji: countryData.emoji,
              emojiU: countryData.emojiU,
            },
          })
        : await this.prisma.country.create({
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
              timezones: (countryData.timezones ?? []) as Prisma.InputJsonValue,
              translations: (countryData.translations ??
                {}) as Prisma.InputJsonValue,
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

      await this.prisma.state.deleteMany({
        where: {
          country_id: country.id,
        },
      });

      if (Array.isArray(countryData.states) && countryData.states.length > 0) {
        for (const stateData of countryData.states) {
          const state = await this.prisma.state.create({
            data: {
              name: stateData.name,
              state_code: stateData.state_code,
              latitude: stateData.latitude,
              longitude: stateData.longitude,
              country_id: country.id,
            },
          });
          seededStates++;

          if (Array.isArray(stateData.cities) && stateData.cities.length > 0) {
            await this.prisma.city.createMany({
              data: stateData.cities.map((cityData) => ({
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

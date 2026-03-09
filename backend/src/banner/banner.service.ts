import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBannerDto, BannerType } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    const { institute_ids, image, ...bannerData } = createBannerDto;

    return (this.prisma as any).banner.create({
      data: {
        ...bannerData,
        image: JSON.stringify(image),
        bannerInstitutes: institute_ids && institute_ids.length > 0 
          ? {
              create: institute_ids.map(id => ({ institute_id: id }))
            }
          : undefined
      },
      include: { bannerInstitutes: true }
    });
  }

  async findAll(query: { type?: BannerType; institute_id?: string; is_active?: boolean }) {
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.is_active !== undefined) where.is_active = query.is_active;
    
    if (query.institute_id) {
      where.OR = [
        { type: BannerType.GENERAL },
        {
          bannerInstitutes: {
            some: { institute_id: query.institute_id }
          }
        }
      ];
    }

    const banners = await (this.prisma as any).banner.findMany({
      where,
      include: { bannerInstitutes: true },
      orderBy: { created_at: 'desc' }
    });

    return banners.map((b: any) => ({
      ...b,
      image: JSON.parse(b.image)
    }));
  }

  async findOne(id: string) {
    const banner = await (this.prisma as any).banner.findUnique({
      where: { id },
      include: { bannerInstitutes: true }
    });

    if (!banner) throw new NotFoundException('Banner not found');

    return {
      ...banner,
      image: JSON.parse(banner.image)
    };
  }

  async update(id: string, updateBannerDto: UpdateBannerDto) {
    const { institute_ids, image, ...bannerData } = updateBannerDto;

    // First delete existing relations if new ones are provided
    if (institute_ids) {
      await (this.prisma as any).bannerInstitute.deleteMany({ where: { banner_id: id } });
    }

    const updated = await (this.prisma as any).banner.update({
      where: { id },
      data: {
        ...bannerData,
        image: image ? JSON.stringify(image) : undefined,
        bannerInstitutes: institute_ids && institute_ids.length > 0
          ? {
              create: institute_ids.map(id => ({ institute_id: id }))
            }
          : undefined
      },
      include: { bannerInstitutes: true }
    });

    return {
      ...updated,
      image: JSON.parse(updated.image)
    };
  }

  async remove(id: string) {
    await (this.prisma as any).banner.delete({ where: { id } });
    return { message: 'Banner deleted successfully' };
  }
}

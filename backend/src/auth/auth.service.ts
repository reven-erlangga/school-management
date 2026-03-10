import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async login(username: string, password?: string) {
    const user = await (this.prisma as any).user.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = user.userRoles.map((ur: any) => ur.role.slug);

    const permissions = user.userRoles.flatMap((ur: any) =>
      ur.role.rolePermissions.map((rp: any) => rp.permission.slug),
    );

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
      permissions,
    };

    const tokens = this.generateTokens(payload);

    return new AuthEntity(tokens);
  }

  async refreshToken(token: string) {
    try {
      console.log('[Auth] Refreshing token...', {
        token: token.substring(0, 10) + '...',
      });
      const payload = this.jwtService.verify(token);
      console.log('[Auth] Refresh token payload:', payload);

      delete payload.iat;
      delete payload.exp;

      const tokens = this.generateTokens(payload);
      return new AuthEntity(tokens);
    } catch (e) {
      console.error('[Auth] Refresh token error:', e.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateToken(token: string) {
    try {
      console.log('[Auth] Validating token...', {
        token: token.substring(0, 10) + '...',
      });
      const payload = this.jwtService.verify(token);
      console.log('[Auth] Token payload:', payload);
      return payload;
    } catch (e) {
      console.error('[Auth] Token validation error:', e.message);
      throw new UnauthorizedException('Invalid access token');
    }
  }
}

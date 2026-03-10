import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Get,
  Header,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthEntity } from './entities/auth.entity';
import { toResponse } from '../common/query-builder/interfaces/response.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and return tokens' })
  @ApiResponse({
    status: 200,
    description: 'Return access and refresh tokens',
    type: AuthEntity,
  })
  async login(@Body() body: any) {
    const result = await this.authService.login(body.username, body.password);
    console.log('[AuthController] Login result:', toResponse(result));
    return toResponse(result);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Return new access and refresh tokens',
    type: AuthEntity,
  })
  async refresh(@Body('refreshToken') token: string) {
    if (!token) throw new UnauthorizedException('Refresh token is required');
    const result = await this.authService.refreshToken(token);
    return toResponse(result);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify access token' })
  async verify(@Headers() headers: any) {
    const auth = headers.authorization || headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token is required');
    }
    const token = auth.split(' ')[1];
    const result = await this.authService.validateToken(token);
    return toResponse(result);
  }
}

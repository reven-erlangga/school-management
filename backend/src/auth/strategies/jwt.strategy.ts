import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key', // Fallback for safety
    });
  }

  async validate(payload: any) {
    // The payload is the decoded JWT. We can use it to fetch user data.
    // For now, we'll just return the payload as is.
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}

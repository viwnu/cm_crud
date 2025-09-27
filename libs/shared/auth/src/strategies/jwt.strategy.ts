import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { JwtPayloadDTO, UserIdentityDTO } from '../dto/input';
import { AUTH_TOKEN_NAME } from '../const';

function tokenFromCookie(req: Request): string | null {
  const raw = req?.cookies?.[AUTH_TOKEN_NAME];
  if (!raw) return null;
  return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([tokenFromCookie]),
      ignoreExpiration: false,
      secretOrKey: new ConfigService().get('AUTH_SECRET'),
    });
  }

  async validate(payload: JwtPayloadDTO): Promise<UserIdentityDTO> {
    return { id: payload.sub, email: payload.email };
  }
}

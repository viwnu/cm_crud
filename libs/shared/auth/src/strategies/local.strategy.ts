import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { UserIdentityDTO } from '../dto/input';
import { LOCAL_STRATEGY_FIELDS } from '../const';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: LOCAL_STRATEGY_FIELDS.USERNAME,
      passwordField: LOCAL_STRATEGY_FIELDS.PASSWORD,
    });
  }

  async validate(email: string, password: string): Promise<UserIdentityDTO> {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

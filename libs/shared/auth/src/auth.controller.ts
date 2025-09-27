import { Body, Controller, Delete, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { RequestProp } from '@app/decorators/param';
import { AuthService } from './auth.service';
import { LocalAuthGuard, JwtAuthGuard } from './guards';
import { LoginInputModel, RefreshToken, UserIdentityDTO } from './dto/input';
import { SetAccessToken, ClearAccesToken } from './interceptors';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiDoc({
    title: 'Login User and return refresh_token',
    response: { status: 201, type: RefreshToken, description: 'refresh_token' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.badRequest],
    requestBody: { type: LoginInputModel, description: 'login data' },
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(SetAccessToken)
  @Post('login')
  async login(@RequestProp('user') user: UserIdentityDTO) {
    return await this.authService.login(user);
  }

  @ApiDoc({
    title: 'Refresh and return refresh_token',
    response: { status: 201, type: RefreshToken, description: 'refresh_token' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.badRequest],
  })
  @UseInterceptors(SetAccessToken)
  @Post('refresh')
  async refresh(@Body() refreshTokenInput: RefreshToken): Promise<RefreshToken> {
    return await this.authService.refreshTokens(refreshTokenInput.refresh_token);
  }

  @ApiDoc({
    title: 'Logout User clear cookies delete refreshToken',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClearAccesToken)
  @Patch()
  async logout(@RequestProp('user') user: UserIdentityDTO): Promise<void> {
    await this.authService.logout(user);
  }

  @ApiDoc({
    title: 'Delete User',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@RequestProp('user') user: UserIdentityDTO): Promise<void> {
    await this.authService.remove(user);
  }
}

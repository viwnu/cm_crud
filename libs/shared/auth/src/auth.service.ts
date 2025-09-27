import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { LoginInputModel, JwtPayloadDTO, CreateUserIdentityDto, UserIdentityDTO } from './dto/input';
import { TokensDTO } from './dto/view';
import { UserIdentityEntity } from './db';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserIdentityEntity) private readonly userIdentityRepository: Repository<UserIdentityEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: LoginInputModel): Promise<UserIdentityDTO | null> {
    const user = await this.userIdentityRepository.findOne({ where: { email } });
    if (!user) return null;
    const passwordValid = await bcrypt.compare(password, user?.password);
    if (passwordValid) {
      return plainToInstance(UserIdentityDTO, user, { excludeExtraneousValues: true });
    }
    return null;
  }

  /**
   * Return UserIdentityEntity with hashed password.
   * Throw ForbiddenException if user with passed email already exists.
   */
  async signup(createUserDto: CreateUserIdentityDto): Promise<UserIdentityEntity> {
    if (await this.userIdentityRepository.findOne({ where: { email: createUserDto.email } }))
      throw new ForbiddenException('User already exists');
    const hashPassword = await bcrypt.hash(createUserDto.password, 5);
    return plainToInstance(UserIdentityEntity, { ...createUserDto, password: hashPassword });
  }

  async login(userIdentity: UserIdentityDTO): Promise<TokensDTO> {
    const payload: JwtPayloadDTO = { email: userIdentity.email, sub: userIdentity.id };
    return await this.updateTokens(payload);
  }

  async logout(userIdentity: UserIdentityDTO): Promise<void> {
    const user = await this.userIdentityRepository.findOne({ where: { id: userIdentity.id } });
    if (!user || !user.refreshToken) throw new UnauthorizedException('Unauthorized');
    await this.userIdentityRepository.save(plainToInstance(UserIdentityEntity, { ...user, refreshToken: null }));
  }

  async remove(userIdentity: UserIdentityDTO): Promise<void> {
    const user = await this.userIdentityRepository.findOne({ where: { id: userIdentity.id } });
    if (!user) throw new UnauthorizedException('User is not exists');
    await this.userIdentityRepository.delete(userIdentity.id);
  }

  async refreshTokens(refresh_token: string): Promise<TokensDTO> {
    const payload: JwtPayloadDTO = this.verifyToken(refresh_token);
    const user = await this.userIdentityRepository.findOne({ where: { email: payload.email, id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException();
    }
    const validRefreshToken = user ? await bcrypt.compare(refresh_token, user.refreshToken) : false;
    if (!validRefreshToken) {
      throw new UnauthorizedException({
        message: 'Unauthorized - refreshToken is invalid',
      });
    }
    return await this.updateTokens(payload);
  }

  private async updateTokens(payload: JwtPayloadDTO): Promise<TokensDTO> {
    const tokens = this.createTokens(instanceToPlain(payload));
    const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 5);
    // await this.userIdentityRepository.save(plainToInstance(UserIdentityEntity, { ...user, refreshToken: hashedRefreshToken }));
    await this.userIdentityRepository.update(payload.sub, { refreshToken: hashedRefreshToken });
    return tokens;
  }

  private createTokens(payload: any): TokensDTO {
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  verifyToken(token: string): JwtPayloadDTO {
    try {
      const payload = plainToInstance(JwtPayloadDTO, this.jwtService.verify(token), {
        excludeExtraneousValues: true,
      });
      if (validateSync(payload).length > 0) throw new UnauthorizedException('Unauthorized');
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}

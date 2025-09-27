import { PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserIdentityEntity } from '../../db';

export class JwtPayloadDTO extends PickType(UserIdentityEntity, ['email']) {
  @IsDefined()
  @IsEmail()
  @Expose()
  email: string;

  @IsDefined()
  @IsUUID()
  @Expose()
  sub: string;
}

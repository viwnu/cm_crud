import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserIdentityEntity } from '../../db';
import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsUUID } from 'class-validator';

export class UserIdentityDTO extends PickType(UserIdentityEntity, ['id', 'email']) {
  @ApiProperty({ type: 'string', description: 'user email', example: 'example@email.com' })
  @IsDefined()
  @IsEmail()
  @Expose()
  id: string;

  @IsDefined()
  @IsUUID()
  @Expose()
  email: string;
}

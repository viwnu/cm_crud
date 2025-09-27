import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';
import { UserIdentityEntity } from '../../db';

export class LoginInputModel extends PickType(UserIdentityEntity, ['email', 'password']) {
  @ApiProperty({ type: 'string', description: 'user email', example: 'example@email.com' })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', description: 'user password', example: 'my-strong-password' })
  @IsDefined()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { UserIdentityEntity } from '@app/auth/db';
import { ManagerEntity } from 'src/db/entities';

export class CreateManagerDto implements Pick<ManagerEntity, 'name'>, Pick<UserIdentityEntity, 'email' | 'password'> {
  @ApiProperty({ type: 'string', example: 'Steven', description: 'The name of manager' })
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({ type: 'string', example: 'example@email.com', description: 'The unique email address' })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', example: 'my-strong-password', description: 'The password of manager' })
  @IsDefined()
  @IsString()
  password: string;
}

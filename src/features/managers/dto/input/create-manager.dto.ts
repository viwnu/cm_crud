import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { ManagerEntity } from 'src/db/entities';

export class CreateManagerDto extends PickType(ManagerEntity, ['name']) {
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

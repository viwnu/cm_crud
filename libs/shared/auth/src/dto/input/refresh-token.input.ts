import { ApiProperty, PickType } from '@nestjs/swagger';
import { TokensDTO } from '../view';
import { IsDefined, IsJWT } from 'class-validator';

export class RefreshToken extends PickType(TokensDTO, ['refresh_token']) {
  @ApiProperty({ type: 'string', description: 'refresh_token', example: 'asdfgsdlfkg34kldnflgsdlfg' })
  @IsDefined()
  @IsJWT()
  refresh_token: string;
}

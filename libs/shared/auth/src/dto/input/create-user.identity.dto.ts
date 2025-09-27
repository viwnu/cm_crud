import { UserIdentityEntity } from '../../db';
import { OmitType } from '@nestjs/swagger';

export class CreateUserIdentityDto extends OmitType(UserIdentityEntity, ['id', 'refreshToken']) {}

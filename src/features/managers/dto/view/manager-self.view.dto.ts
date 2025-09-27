import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose } from 'class-transformer';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { SerializedView } from '@app/serializer/interface';
import { ManagerEntity } from 'src/db/entities';

export class ManagerSelfView extends OmitType(ManagerEntity, ['userIdentity']) implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique manager id' })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Destroer 8000', description: 'Manager name' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', example: 'example@email.com', description: 'Manager email' })
  @IsEmail()
  @Expose()
  get email(): string {
    return this.userIdentity.email;
  }

  userIdentity: UserIdentityDTO;

  static serializerOptions: ClassSerializerContextOptions = { strategy: 'excludeAll', type: ManagerSelfView };
}

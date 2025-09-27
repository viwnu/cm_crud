import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { ManagerEntity } from 'src/db/entities';

export class ManagerInternalView extends PickType(ManagerEntity, ['id', 'name']) {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique manager id' })
  @IsUUID()
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Destroer 8000', description: 'Manager name' })
  @IsString()
  @Expose()
  name: string;

  @Expose()
  userIdentity: UserIdentityDTO;
}

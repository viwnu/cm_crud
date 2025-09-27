import { PickType } from '@nestjs/swagger';
import { CreateManagerDto } from '.';

export class UpdateManagerDto extends PickType(CreateManagerDto, ['name']) {}

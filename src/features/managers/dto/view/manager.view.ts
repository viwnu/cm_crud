import { PickType } from '@nestjs/swagger';
import { ManagerSelfView } from './manager-self.view.dto';

export class ManagerViewDTO extends PickType(ManagerSelfView, ['id', 'name']) {}

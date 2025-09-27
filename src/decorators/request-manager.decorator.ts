import { RequestProp } from '@app/decorators/param';
import { REQUEST_PROP_NAMES } from 'src/const';
import { ManagerSelfView } from 'src/features/managers/dto/view';

export function RequestManager() {
  return RequestProp<{ [REQUEST_PROP_NAMES.MANAGER]: ManagerSelfView }>(REQUEST_PROP_NAMES.MANAGER);
}

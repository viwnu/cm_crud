import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { RequestWithProp } from '@app/decorators/param';
import { REQUEST_PROP_NAMES } from 'src/const';
import { ManagersService } from '../managers.service';
import { ManagerInternalView } from '../dto/view';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private readonly managersService: ManagersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequestManager(request);
  }
  async validateRequestManager(request: RequestWithProp<{ [REQUEST_PROP_NAMES.USER]: UserIdentityDTO }>): Promise<boolean> {
    const foundedUser = await this.managersService.findOneByEmail(request.user.email);
    if (!foundedUser) return false;
    this.setRequestUser(request, foundedUser);
    return true;
  }

  setRequestUser(
    request: RequestWithProp<{
      [REQUEST_PROP_NAMES.USER]: UserIdentityDTO;
      [REQUEST_PROP_NAMES.MANAGER]?: ManagerInternalView;
    }>,
    manager: ManagerInternalView,
  ): void {
    request.manager = manager;
  }
}

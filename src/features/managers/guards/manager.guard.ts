import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { RequestWithProp } from '@app/decorators/param';
import { REQUEST_PROP_NAMES } from 'src/const';
import { ManagersService } from '../managers.service';
import { ManagerInternalView } from '../dto/view';
import { WinstonLogger } from '@app/logger';

@Injectable()
export class ManagerGuard implements CanActivate {
  private readonly logger = new WinstonLogger(ManagerGuard.name);

  constructor(private readonly managersService: ManagersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequestManager(request);
  }
  async validateRequestManager(request: RequestWithProp<{ [REQUEST_PROP_NAMES.USER]: UserIdentityDTO }>): Promise<boolean> {
    this.logger.log(`Validating request manager, email: ${request?.user?.email}`);
    const foundedUser = await this.managersService.findOneByEmail(request?.user?.email);
    if (!foundedUser) {
      this.logger.warn(`Request user was not founded, email: ${request?.user?.email}`);
      return false;
    }
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

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithProp } from '.';

export function RequestProp<T>(paramName: keyof T) {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithProp<T>>();
    return request[paramName];
  })();
}

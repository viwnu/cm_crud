import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { AUTH_TOKEN_NAME } from '../const';

@Injectable()
export class ClearAccesToken implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        response.clearCookie(AUTH_TOKEN_NAME);
        return data;
      }),
    );
  }
}

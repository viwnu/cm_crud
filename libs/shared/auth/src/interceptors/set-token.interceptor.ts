import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { AUTH_TOKEN_NAME } from '../const';

@Injectable()
export class SetAccessToken implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data?.access_token) {
          response.cookie(AUTH_TOKEN_NAME, `Bearer ${data.access_token}`, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
          });

          const { access_token: _ignoredToken, ...rest } = data;
          return rest;
        }
        return data;
      }),
    );
  }
}

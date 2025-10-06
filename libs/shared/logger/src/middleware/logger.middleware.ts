// src/middleware/logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from '../config/logger.config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      winstonLogger.info({
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        statusCode,
        durationMs: duration,
        ip: req.ip,
        userAgent: req.get('user-agent') || '',
      });
    });

    next();
  }
}

import { LoggerService } from '@nestjs/common';
import { createLogger, format, transports, Logger } from 'winston';

export class WinstonLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(private readonly context?: string) {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.colorize({ all: true }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
          const ctx = this.context ? ` \x1b[36m[${context}]\x1b[0m` : ''; // cyan context
          return `[${timestamp}] [${level}]${ctx ?? ''}: ${message}`;
        }),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log', level: 'info' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(trace ? `${message} - ${trace}` : message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}

import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'requests-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
    }),
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

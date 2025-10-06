import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { WinstonLogger } from './winston-logger.service';

@Module({
  controllers: [LoggerController],
  providers: [LoggerService, WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}

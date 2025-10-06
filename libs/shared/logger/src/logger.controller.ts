import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from './logger.service';
import { QueryDto } from './dto/query.dto';
import { ApiDoc } from '@app/api-doc';
import { GET_LOGS_DOC } from './doc';

@ApiTags('Logs')
@Controller('logs')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ApiDoc(GET_LOGS_DOC)
  @Get()
  getLogs(@Query() { date }: QueryDto) {
    return this.loggerService.getLogs(date);
  }
}

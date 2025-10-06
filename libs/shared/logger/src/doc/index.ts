import { ApiDocOptions } from '@app/api-doc';
import { HttpStatus } from '@nestjs/common';

export const GET_LOGS_DOC: ApiDocOptions = {
  title: { summary: 'Return logs by data' },
  queries: [
    {
      name: 'date',
      example: '2025-06-22',
      required: false,
      type: 'string',
    },
  ],
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Logs data',
    },
    {
      status: HttpStatus.NOT_FOUND,
      example: 'Log file for ${targetDate} not found',
      description: 'Logs for passed date not found',
    },
  ],
};

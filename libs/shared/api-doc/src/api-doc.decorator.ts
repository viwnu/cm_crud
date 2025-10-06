import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiDocOptions } from '.';

export function ApiDoc({ title, body, responses = [], params = [], queries = [], auth }: ApiDocOptions) {
  return applyDecorators(
    ApiOperation(title),
    ...(body ? [ApiBody(body)] : []),
    ...responses?.map((response) => ApiResponse({ ...response })),
    ...params.map((param) => ApiParam(param)),
    ...queries.map((query) => ApiQuery(query)),
    ...(auth === 'bearer' ? [ApiBearerAuth()] : []),
  );
}

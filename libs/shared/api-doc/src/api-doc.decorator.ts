import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApiDocOptions } from '.';

export function ApiDoc({ title, requestBody, params, queries, response, auth, exceptions = [] }: ApiDocOptions) {
  const authDecorator = auth === 'bearer' ? [ApiBearerAuth()] : [];
  const requestBodyDecorator = requestBody ? [ApiBody({ type: requestBody.type, description: requestBody.description })] : [];
  const paramDecorator = params ? params.map((param) => ApiParam(param)) : [];
  const queryDecorator = queries ? queries.map((query) => ApiQuery(query)) : [];
  return applyDecorators(
    ApiOperation({ summary: title }),
    ApiResponse({ status: 201, type: response.type }),
    ...authDecorator,
    ...requestBodyDecorator,
    ...paramDecorator,
    ...queryDecorator,
    ...exceptions?.map((exception) => ApiResponse({ ...exception })),
  );
}

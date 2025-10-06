import { ApiBodyOptions, ApiOperationOptions, ApiParamOptions, ApiQueryOptions, ApiResponseOptions } from '@nestjs/swagger';

export type ApiDocOptions = {
  title: ApiOperationOptions;
  body?: ApiBodyOptions;
  responses: ApiResponseOptions[];
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  auth?: 'bearer';
};

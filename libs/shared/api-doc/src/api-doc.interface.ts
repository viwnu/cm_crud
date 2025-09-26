import { ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger';

export interface ApiDocResponse {
  status: number;
  type?: any;
  description: string;
}

export interface ApiRequestBody {
  type?: any;
  description: string;
}

export interface ApiDocOptions {
  title: string;
  requestBody?: ApiRequestBody;
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  response: ApiDocResponse;
  auth?: 'bearer';
  exceptions?: ApiDocResponse[];
  parameter?: ApiQueryOptions;
}

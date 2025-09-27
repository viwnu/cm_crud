import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiDocResponse } from '../';

export class ApiDocExceptions {
  static notFound: ApiDocResponse = {
    status: 404,
    type: NotFoundException,
    description: 'NotFoundException object',
  };
  static badRequest: ApiDocResponse = {
    status: 400,
    type: BadRequestException,
    description: 'BadRequestException object',
  };
  static unauthorized: ApiDocResponse = {
    status: 401,
    type: UnauthorizedException,
    description: 'UnauthorizedException object',
  };
  static forbidden: ApiDocResponse = {
    status: 403,
    type: ForbiddenException,
    description: 'ForbiddenException object',
  };
}

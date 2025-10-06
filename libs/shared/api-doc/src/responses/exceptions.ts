import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export class ApiDocExceptions {
  static notFound: ApiResponseOptions = {
    status: 404,
    type: NotFoundException,
    description: 'NotFoundException object',
  };
  static badRequest: ApiResponseOptions = {
    status: 400,
    type: BadRequestException,
    description: 'BadRequestException object',
  };
  static unauthorized: ApiResponseOptions = {
    status: 401,
    type: UnauthorizedException,
    description: 'UnauthorizedException object',
  };
  static forbidden: ApiResponseOptions = {
    status: 403,
    type: ForbiddenException,
    description: 'ForbiddenException object',
  };
}

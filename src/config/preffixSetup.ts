import { INestApplication } from '@nestjs/common';

export const prefixSetup = (app: INestApplication) => {
  app.setGlobalPrefix('api');
};

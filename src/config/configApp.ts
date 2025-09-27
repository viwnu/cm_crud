import { INestApplication } from '@nestjs/common';
import { pipesSetup, prefixSetup, swaggerSetup } from '.';
import { cookieParserSetup } from './cookieParserSetup';
import { corseSetup } from './corseSetup';

export const configApp = (app: INestApplication) => {
  pipesSetup(app);
  prefixSetup(app);
  swaggerSetup(app);
  cookieParserSetup(app);
  corseSetup(app);
};

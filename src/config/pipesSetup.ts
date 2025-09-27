import { INestApplication, ValidationPipe } from '@nestjs/common';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, disableErrorMessages: false }));
};

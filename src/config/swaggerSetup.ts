import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('REST API Chat')
    .setDescription('The REST API Chat API description')
    .setVersion('1.0')
    .addTag('RCh')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.DOCUMENTATION === 'enable') SwaggerModule.setup('api/docs', app, document);
};

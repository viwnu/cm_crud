import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Content management CRUD API')
    .setDescription('The REST API for management content and view of articles')
    .setVersion('1.0')
    .addTag('CM_CRUD')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  if (process.env.DOCUMENTATION === 'enable') SwaggerModule.setup('api/docs', app, document);
};

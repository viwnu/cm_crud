import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './features/articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './db';
import { ManagersModule } from './features/managers/managers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.api.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ArticlesModule,
    ManagersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

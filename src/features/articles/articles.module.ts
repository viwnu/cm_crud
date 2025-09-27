import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity, ArticleEntity } from 'src/db/entities';
import { ManagersModule } from '../managers/managers.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEntity, ArticleEntity]), ManagersModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { ArticleEntity } from 'src/db/entities';
import { ManagerInternalView } from '../managers/dto/view';
import { CreateArticleDTO, UpdateArticleDTO } from './dto/input';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { WinstonLogger } from '@app/logger';

export type ArticlesFindAllOptions = {
  limit?: number;
  page?: number;
  authorId?: string;
  createdFromTo?: [Date, Date];
};

@Injectable()
export class ArticlesService {
  private readonly logger = new WinstonLogger(ArticlesService.name);
  constructor(
    @InjectRepository(ArticleEntity) private readonly articlesRepository: Repository<ArticleEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(author: ManagerInternalView, createArticleDto: CreateArticleDTO) {
    this.logger.log(`Creating article by author: ${author.id}`);
    await this.articlesRepository.save({ ...createArticleDto, author });
    await this.cacheManager.clear();
  }

  // Добавьте возможность фильтрации статей по различным критериям (например, по дате публикации, автору).
  async findAll({ limit = 10, page = 0, authorId, createdFromTo }: ArticlesFindAllOptions) {
    this.logger.log(`Get articles by author ${authorId}`);
    const [articles, count] = await this.articlesRepository.findAndCount({
      relations: { author: true },
      where: {
        ...(authorId ? { author: { id: authorId } } : {}),
        ...(createdFromTo ? { created: Between(...createdFromTo) } : {}),
      },
      skip: page * limit,
      take: limit,
    });
    return { articles, count };
  }

  async update(id: string, updateArticleDto: UpdateArticleDTO) {
    this.logger.log(`Update article ${id}`);
    const existing = await this.findOneById(id);
    await this.articlesRepository.save({ ...existing, ...updateArticleDto });
    await this.cacheManager.clear();
  }

  async remove(id: string) {
    this.logger.log(`Remove article ${id}`);
    const existing = await this.findOneById(id);
    await this.articlesRepository.remove(existing);
    await this.cacheManager.clear();
  }

  async findOneById(id: string) {
    this.logger.log(`Looking for article ${id}`);
    const existing = await this.articlesRepository.findOneBy({ id });
    if (!existing) {
      this.logger.warn(`Article not found ${id}`);
      throw new NotFoundException('Article was not found!');
    }
    return existing;
  }
}

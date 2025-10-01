import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { ArticleEntity } from 'src/db/entities';
import { ManagerInternalView } from '../managers/dto/view';
import { CreateArticleDTO, UpdateArticleDTO } from './dto/input';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

export type ArticlesFindAllOptions = {
  limit?: number;
  page?: number;
  authorId?: string;
  createdFromTo?: [Date, Date];
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articlesRepository: Repository<ArticleEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(author: ManagerInternalView, createArticleDto: CreateArticleDTO) {
    await this.articlesRepository.save({ ...createArticleDto, author });
    await this.cacheManager.clear();
  }

  // Добавьте возможность фильтрации статей по различным критериям (например, по дате публикации, автору).
  async findAll({ limit = 10, page = 0, authorId, createdFromTo }: ArticlesFindAllOptions) {
    console.log('get from DB');
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
    const existing = await this.findOneById(id);
    await this.articlesRepository.save({ ...existing, ...updateArticleDto });
    await this.cacheManager.clear();
  }

  async remove(id: string) {
    const existing = await this.findOneById(id);
    await this.articlesRepository.remove(existing);
    await this.cacheManager.clear();
  }

  async findOneById(id: string) {
    const existing = await this.articlesRepository.findOneBy({ id });
    if (!existing) throw new NotFoundException('Article was not found!');
    return existing;
  }
}

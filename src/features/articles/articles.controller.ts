import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { JwtAuthGuard } from '@app/auth/guards';
import { ManagerGuard } from '../managers/guards';
import { RequestManager } from 'src/decorators';
import { ManagerInternalView } from '../managers/dto/view';
import { CreateArticleDTO, FindArticlesDto, UpdateArticleDTO } from './dto/input';
import { ArticleFindAllResponseDTO } from './dto/view';
import { SerializeView } from '@app/serializer';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @ApiDoc({
    title: 'Add Article',
    response: { status: 201, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Post()
  async create(@RequestManager() user: ManagerInternalView, @Body() createChatDto: CreateArticleDTO): Promise<void> {
    await this.articlesService.create(user, createChatDto);
  }

  @ApiDoc({
    title: 'Get all articles by passed filters',
    response: { status: 200, type: [ArticleFindAllResponseDTO], description: 'Array of articles and total number of them' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
    auth: 'bearer',
    queries: [
      { name: 'limit', required: false, example: 10 },
      { name: 'page', required: false, example: 0 },
      { name: 'authorId', required: false, example: '99983c50-b930-4d07-97c8-fcaa5e1347a1' },
      { name: 'createdFromTo', required: false, example: ['2025-09-27T11:38:20.901Z', '2024-09-27T11:38:20.901Z'] },
    ],
  })
  @SerializeView(ArticleFindAllResponseDTO)
  @UseInterceptors(CacheInterceptor)
  @Get()
  async findAll(@Query() dto: FindArticlesDto) {
    return await this.articlesService.findAll(dto);
  }

  @Patch(':articleId')
  update(@Param('articleId') articleId: string, @Body() updateArticleDto: UpdateArticleDTO) {
    return this.articlesService.update(articleId, updateArticleDto);
  }

  @Delete(':articleId')
  remove(@Param('articleId') articleId: string) {
    return this.articlesService.remove(articleId);
  }
}

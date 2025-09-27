import { ApiProperty } from '@nestjs/swagger';
import { ArticleViewDTO } from './article-view.dto';
import { Expose, Type } from 'class-transformer';
import { ClassSerializerContextOptions } from '@nestjs/common';

export class ArticleFindAllResponseDTO {
  @ApiProperty({ type: 'number', example: 10, description: 'The total number of articles' })
  @Expose()
  count: number;

  @Type(() => ArticleViewDTO)
  @ApiProperty({ type: [ArticleViewDTO], description: 'All filtered articles' })
  @Expose()
  articles: ArticleViewDTO[];
  static serializerOptions: ClassSerializerContextOptions = { strategy: 'excludeAll', type: ArticleFindAllResponseDTO };
}

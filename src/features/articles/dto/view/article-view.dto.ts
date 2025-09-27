import { ClassSerializerContextOptions } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CreateArticleDTO } from '../input';
import { ManagerViewDTO } from 'src/features/managers/dto/view';

export class ArticleViewDTO extends CreateArticleDTO {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique article id' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Global warming', description: 'Title of article' })
  @Expose()
  title: string;

  @ApiProperty({ type: 'string', example: 'About what the governments do to stop it', description: 'Article description' })
  @Expose()
  description: string;

  @ApiProperty({ type: 'string', example: 'The are do nothing', description: 'Article content' })
  @Expose()
  content: string;

  @ApiProperty({ type: 'string', example: '2025-09-27T11:38:20.901Z', description: 'Day of article publication' })
  @Expose()
  created: Date;

  @Type(() => ManagerViewDTO)
  @ApiProperty({ type: ManagerViewDTO, description: 'Author of article' })
  @Expose()
  author: ManagerViewDTO;

  static serializerOptions: ClassSerializerContextOptions = { strategy: 'excludeAll', type: ArticleViewDTO };
}

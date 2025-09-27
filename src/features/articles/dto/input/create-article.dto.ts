import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';
import { ArticleEntity } from 'src/db/entities';

export class CreateArticleDTO implements Pick<ArticleEntity, 'title' | 'description' | 'content'> {
  @ApiProperty({ type: 'string', example: 'Global warming', description: 'Title of article' })
  @IsDefined()
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', example: 'About what the governments do to stop it', description: 'Article description' })
  @IsDefined()
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', example: 'The are do nothing', description: 'Article content' })
  @IsDefined()
  @IsString()
  content: string;
}

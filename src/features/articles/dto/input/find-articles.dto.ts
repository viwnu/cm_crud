import { ApiProperty } from '@nestjs/swagger';
import { ArticlesFindAllOptions } from '../../articles.service';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindArticlesDto implements ArticlesFindAllOptions {
  @ApiProperty({
    type: 'number',
    description: 'A limit of articles per page (default 10)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    type: 'number',
    description: 'A number of page (default 0)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  page: number;

  @ApiProperty({
    type: 'string',
    description: 'Author of an articles',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  authorId: string;

  @ApiProperty({
    type: [Date],
    description: 'A dates of articles was published from /to',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  @Type(() => Date)
  createdFromTo: [Date, Date];
}

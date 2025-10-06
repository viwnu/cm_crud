import { IsDateString, IsOptional } from 'class-validator';

export class QueryDto {
  @IsOptional()
  @IsDateString()
  date: string;
}

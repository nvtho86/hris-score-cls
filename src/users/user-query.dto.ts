import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UserQueryDto {
  @IsOptional()
  @Type(() => Number)
  page:number = 1;

  @IsOptional()
  @Type(() => Number)
  limit: number = 20;

  @IsOptional()
  search?: string;

  @IsOptional()
  department?: string;

  @IsOptional()
  branch?: string;

  @IsOptional()
  status?: string;
}
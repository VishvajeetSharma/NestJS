import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Validates the `?page=&limit=` query string params on GET /tasks.
 * `@Type(() => Number)` (class-transformer) converts the raw string
 * query params into numbers before class-validator's `@IsInt()` runs -
 * without it, every query param would fail validation because
 * Express always parses query strings as strings.
 */
export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

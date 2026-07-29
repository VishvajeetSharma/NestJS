import { IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Validates the PATCH /tasks/:id body. Per the spec, `taskName` is
 * immutable after creation, so it is deliberately NOT a field on this
 * DTO. Combined with the global ValidationPipe's `forbidNonWhitelisted`
 * option (see main.ts), sending a `taskName` field on this endpoint
 * will itself be rejected with a 400 rather than silently ignored.
 *
 * Every field is optional since PATCH allows a partial update.
 */
export class UpdateTaskDto {
  @IsOptional()
  @IsISO8601({}, { message: 'date must be a valid date (YYYY-MM-DD)' })
  date?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt({ message: 'estimatedHours must be an integer' })
  @Min(0)
  @Max(23, { message: 'estimatedHours must be between 0 and 23' })
  estimatedHours?: number;

  @IsOptional()
  @IsInt({ message: 'estimatedMinutes must be an integer' })
  @Min(0)
  @Max(59, { message: 'estimatedMinutes must be between 0 and 59' })
  estimatedMinutes?: number;
}

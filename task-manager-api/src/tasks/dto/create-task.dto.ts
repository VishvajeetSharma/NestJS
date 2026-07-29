import { IsInt, IsISO8601, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Validates the POST /tasks body. `estimatedHours` and
 * `estimatedMinutes` are accepted separately (as the spec requires) and
 * converted into a single `estimatedDurationMinutes` column by
 * TasksService - this DTO's only job is to make sure both numbers are
 * sane before they ever reach business logic.
 */
export class CreateTaskDto {
  @IsISO8601({}, { message: 'date must be a valid date (YYYY-MM-DD)' })
  date: string;

  @IsNotEmpty({ message: 'taskName should not be empty' })
  @IsString()
  taskName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt({ message: 'estimatedHours must be an integer' })
  @Min(0)
  @Max(23, { message: 'estimatedHours must be between 0 and 23' })
  estimatedHours: number;

  @IsInt({ message: 'estimatedMinutes must be an integer' })
  @Min(0)
  @Max(59, { message: 'estimatedMinutes must be between 0 and 59' })
  estimatedMinutes: number;
}

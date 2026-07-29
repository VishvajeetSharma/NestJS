import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { MESSAGES } from '../common/constants/messages.constant';

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * All Task business rules live here, isolated from the HTTP layer
 * (TasksController) and from raw TypeORM query-building details that
 * would otherwise leak into the controller:
 *   - "task name must be unique per user"
 *   - "hours + minutes -> single duration column" conversion
 *   - "users can only see/edit/delete their own tasks"
 *   - "task name can never be edited"
 *
 * Every method is scoped by `userId` at the query level (not just
 * filtered in memory afterwards) so one user can never even discover
 * another user's task exists.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Creates a new task for the given user.
   * Throws 409 if this user already has a task with the same name -
   * checked at the application level (fast, friendly error message)
   * AND enforced by the composite unique index at the DB level as a
   * safety net against race conditions.
   */
  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const existing = await this.taskRepository.findOne({
      where: { userId, taskName: dto.taskName },
    });
    if (existing) {
      throw new ConflictException(MESSAGES.TASK.ALREADY_EXISTS);
    }

    const task = this.taskRepository.create({
      userId,
      date: dto.date,
      taskName: dto.taskName,
      description: dto.description ?? null,
      estimatedDurationMinutes: this.toDurationMinutes(
        dto.estimatedHours,
        dto.estimatedMinutes,
      ),
    });

    return this.taskRepository.save(task);
  }

  /**
   * Returns only the requesting user's tasks, newest first, paginated.
   */
  async findAllForUser(
    userId: string,
    pagination: PaginationQueryDto,
  ): Promise<PaginatedResult<Task>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;

    const [items, total] = await this.taskRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Fetches a single task, but ONLY if it belongs to `userId`.
   * Scoping the WHERE clause by userId (rather than fetching by id
   * alone and comparing afterwards) means a task belonging to another
   * user looks identical to a non-existent task - no information about
   * other users' data is ever leaked.
   */
  async findOneForUser(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, userId },
    });
    if (!task) {
      throw new NotFoundException(MESSAGES.TASK.NOT_FOUND);
    }
    return task;
  }

  /**
   * Updates date/description/duration. Task name is intentionally
   * never touched, even if a client somehow slipped one through - the
   * DTO doesn't have the field, so there is nothing to apply.
   */
  async update(userId: string, taskId: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOneForUser(userId, taskId);

    if (dto.date !== undefined) task.date = dto.date;
    if (dto.description !== undefined) task.description = dto.description;

    if (dto.estimatedHours !== undefined || dto.estimatedMinutes !== undefined) {
      // Fall back to the task's existing duration split when only one
      // of the two fields was provided in the PATCH body.
      const currentHours = Math.floor(task.estimatedDurationMinutes / 60);
      const currentMinutes = task.estimatedDurationMinutes % 60;
      task.estimatedDurationMinutes = this.toDurationMinutes(
        dto.estimatedHours ?? currentHours,
        dto.estimatedMinutes ?? currentMinutes,
      );
    }

    return this.taskRepository.save(task);
  }

  /** Deletes a task, but only if it belongs to the requesting user. */
  async remove(userId: string, taskId: string): Promise<void> {
    const task = await this.findOneForUser(userId, taskId);
    await this.taskRepository.remove(task);
  }

  /** Normalises separate hour/minute inputs into one integer column. */
  private toDurationMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
  }
}

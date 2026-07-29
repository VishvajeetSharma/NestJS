import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { ResponseHelper } from '../common/utils/response.helper';
import { MESSAGES } from '../common/constants/messages.constant';
import { ApiResponse } from '../common/interfaces/api-response.interface';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * HTTP layer for the Task resource. `@UseGuards(JwtAuthGuard)` is
 * applied at the CONTROLLER level so every single route below requires
 * a valid bearer token - there is no way to accidentally add a new
 * endpoint here and forget to protect it.
 *
 * Every method pulls the authenticated user's id off the token via
 * `@CurrentUser()` and passes it straight into TasksService, which
 * scopes every query by that id.
 */
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** POST /tasks - create a new task for the logged-in user. */
  @Post()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTaskDto,
  ): Promise<ApiResponse> {
    const task = await this.tasksService.create(user.sub, dto);
    return ResponseHelper.success(MESSAGES.TASK.CREATE_SUCCESS, task);
  }

  /** GET /tasks?page=&limit= - list the logged-in user's tasks, newest first. */
  @Get()
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query() pagination: PaginationQueryDto,
  ): Promise<ApiResponse> {
    const result = await this.tasksService.findAllForUser(user.sub, pagination);
    return ResponseHelper.success(MESSAGES.TASK.LIST_SUCCESS, result);
  }

  /** GET /tasks/:id - fetch a single task owned by the logged-in user. */
  @Get(':id')
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    const task = await this.tasksService.findOneForUser(user.sub, id);
    return ResponseHelper.success(MESSAGES.TASK.DETAIL_SUCCESS, task);
  }

  /** PATCH /tasks/:id - update date/description/duration (never the name). */
  @Patch(':id')
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<ApiResponse> {
    const task = await this.tasksService.update(user.sub, id, dto);
    return ResponseHelper.success(MESSAGES.TASK.UPDATE_SUCCESS, task);
  }

  /** DELETE /tasks/:id - remove a task owned by the logged-in user. */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<ApiResponse> {
    await this.tasksService.remove(user.sub, id);
    return ResponseHelper.success(MESSAGES.TASK.DELETE_SUCCESS, null);
  }
}

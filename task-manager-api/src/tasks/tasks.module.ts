import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Registers the `Task` entity's repository and imports `AuthModule` so
 * `JwtAuthGuard`/`JwtStrategy` (and the Passport machinery they rely
 * on) are available for `TasksController`'s route-level guards.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

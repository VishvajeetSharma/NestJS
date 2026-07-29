import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Maps the `tasks` table. Each task belongs to exactly one user
 * (Many Tasks -> One User).
 *
 * BUSINESS RULE: a task name must be unique *per user* (not globally).
 * That's implemented with a composite UNIQUE index on (userId, taskName)
 * via the `@Index(['userId', 'taskName'], { unique: true })` decorator
 * below - Postgres itself will reject a duplicate at the DB layer as a
 * defense-in-depth measure, in addition to the application-level check
 * in TasksService (which produces the friendly 409 response).
 */
@Entity('tasks')
@Index(['userId', 'taskName'], { unique: true })
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Foreign key column is declared explicitly (in addition to the
  // `@ManyToOne` relation below) so we can reference `userId` directly
  // in the composite unique index and in query filters without needing
  // to join the full User relation every time.
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // The calendar date the task is scheduled/logged for.
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar', length: 255 })
  taskName: string;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;

  // Stored as a single normalised integer (hours*60 + minutes) so
  // sorting/filtering/summing durations never has to deal with two
  // separate columns.
  @Column({ type: 'int' })
  estimatedDurationMinutes: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

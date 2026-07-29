import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The NestJS runtime gets its TypeORM connection via
 * `TypeOrmModule.forRootAsync()` (see database/typeorm.config.ts), which
 * is wired through Nest's dependency injection and ConfigService.
 *
 * The TypeORM **CLI**, however, runs outside of Nest's DI container
 * entirely (it's a plain node script), so it needs its own plain
 * `DataSource` instance to connect to Postgres and generate/run
 * migrations. This file is that instance - referenced by the
 * `migration:*` npm scripts via `-d src/database/data-source.ts`.
 *
 * `synchronize` is explicitly `false` everywhere in this project, per
 * the spec: schema changes must always go through a reviewed migration
 * file, never be auto-applied by TypeORM at boot.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'task_manager',
  entities: [User, Task],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

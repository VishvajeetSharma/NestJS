import { registerAs } from '@nestjs/config';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Groups all PostgreSQL connection settings under the "database"
 * namespace. TypeOrmModule.forRootAsync() (see database/typeorm.config.ts)
 * reads these values to build the actual DataSource options.
 *
 * Keeping this separate from the TypeORM module wiring means the raw
 * environment values can be unit tested / mocked independently of
 * TypeORM itself.
 */
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USERNAME ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  name: process.env.DATABASE_NAME ?? 'task_manager',
}));

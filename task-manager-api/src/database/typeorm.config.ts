import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../tasks/entities/task.entity';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Factory function consumed by `TypeOrmModule.forRootAsync()` in
 * AppModule. Builds the actual runtime connection options from the
 * validated `ConfigService` (rather than reading `process.env`
 * directly), which keeps the app's DB wiring testable and consistent
 * with the rest of the config module.
 *
 * `synchronize: false` is intentional and required by the spec - all
 * schema changes must flow through the migration files in
 * database/migrations/.
 */
export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: [User, Task],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: false,
  logging: configService.get<string>('app.nodeEnv') === 'development',
});

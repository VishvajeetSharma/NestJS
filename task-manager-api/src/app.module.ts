import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { typeOrmConfigFactory } from './database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { HealthModule } from './health/health.module';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The root module. Its ONLY job is composition - wiring together every
 * feature module and cross-cutting infrastructure concern:
 *
 *   - `ConfigModule.forRoot({ isGlobal: true })` loads `.env` once and
 *     makes `ConfigService` injectable everywhere, without every
 *     feature module needing to re-import ConfigModule.
 *   - `TypeOrmModule.forRootAsync` opens the single shared PostgreSQL
 *     connection pool used by every feature module.
 *   - `ServeStaticModule` exposes the `uploads/` folder over HTTP so
 *     uploaded profile pictures are directly downloadable at
 *     `/uploads/profile/<filename>`.
 *   - Feature modules (Auth, Users, Tasks, Health) each own their own
 *     controllers/services/entities and are simply assembled here.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfigFactory,
    }),
    ServeStaticModule.forRoot({
      // Requests to /uploads/* are served directly from the physical
      // "uploads" folder at the project root - this is what makes
      // uploaded profile pictures downloadable via a plain URL.
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}

import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The single entry point of the application. Everything that applies
 * to EVERY request - security headers, compression, request logging,
 * CORS, global validation, global error shaping, and static file
 * serving for uploaded images - is configured here, once, instead of
 * being duplicated per-module.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Buffer Nest's own startup logs; Morgan below handles per-request
    // access logging once the server is listening.
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const uploadPath = configService.get<string>('app.uploadPath') ?? 'uploads/profile';

  // ---------------------------------------------------------------
  // SECURITY: Helmet sets a range of protective HTTP headers
  // (X-Content-Type-Options, X-Frame-Options, etc.) with one call.
  // ---------------------------------------------------------------
  app.use(helmet());

  // ---------------------------------------------------------------
  // CORS: allow cross-origin requests. Wide-open by default for local
  // development/Postman testing - lock this down to specific origins
  // via an env var before deploying publicly.
  // ---------------------------------------------------------------
  app.use(cors());

  // ---------------------------------------------------------------
  // COMPRESSION: gzip response bodies to reduce payload size.
  // ---------------------------------------------------------------
  app.use(compression());

  // ---------------------------------------------------------------
  // LOGGING: Morgan prints a standard access-log line per request
  // ("combined" in production for full detail, "dev" locally for
  // concise, colourised output).
  // ---------------------------------------------------------------
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

  // ---------------------------------------------------------------
  // STATIC FILES: serve everything under the physical "uploads/"
  // folder at the "/uploads" URL prefix, so an uploaded profile
  // picture stored at uploads/profile/<uuid>.png is downloadable at
  // GET /uploads/profile/<uuid>.png. (ServeStaticModule in
  // AppModule also registers this - this second explicit call
  // guarantees the folder exists and is served even if the Nest
  // static module's root resolution differs across environments.)
  // ---------------------------------------------------------------
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });
  void uploadPath; // referenced for clarity/documentation purposes above

  // ---------------------------------------------------------------
  // GLOBAL VALIDATION: every incoming request body/query is validated
  // against its DTO's class-validator decorators.
  //   - whitelist: strips any property not declared on the DTO
  //   - forbidNonWhitelisted: REJECTS the request (400) if it contains
  //     an unknown property, rather than silently dropping it - this
  //     is what makes "taskName cannot be edited" enforceable: sending
  //     taskName on PATCH /tasks/:id is rejected outright.
  //   - transform: converts plain JSON/query values into typed DTO
  //     instances (e.g. numeric strings -> numbers).
  // ---------------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ---------------------------------------------------------------
  // GLOBAL ERROR SHAPING: every thrown exception (validation errors,
  // 404s, 409s, unexpected 500s) is normalised into the project-wide
  // { success, message, data, errors } envelope.
  // ---------------------------------------------------------------
  app.useGlobalFilters(new HttpExceptionFilter());

  // ---------------------------------------------------------------
  // GLOBAL LOGGING INTERCEPTOR: framework-level request/response
  // duration logging, complementary to Morgan's raw access log.
  // ---------------------------------------------------------------
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(`📁 Profile uploads served from: /uploads/profile`, 'Bootstrap');
}

bootstrap();

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Morgan (wired up in main.ts) logs the raw HTTP access line
 * (method, url, status, response time) the way an ops engineer expects
 * to see it in stdout. This interceptor complements that by using
 * Nest's own Logger to record request completion at the
 * application-framework level, which is useful once we move to
 * structured/JSON logging later - swapping this one class is enough,
 * no controller code has to change.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(`${method} ${originalUrl} - ${duration}ms`);
      }),
    );
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorDetail, ApiResponse } from '../interfaces/api-response.interface';
import { MESSAGES } from '../constants/messages.constant';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The spec mandates that the API NEVER leaks a "raw" Nest/Express error
 * response - every error (validation, 404, 409, unexpected 500s, etc.)
 * must come back as:
 *
 *   { success: false, message, data: null, errors: [...] }
 *
 * `@Catch()` with no arguments means this filter catches EVERY
 * exception thrown anywhere in the app (both HttpException subclasses
 * and unexpected runtime errors), so we only need one place that knows
 * how to format an error response.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = MESSAGES.COMMON.INTERNAL_ERROR;
    let errors: ApiErrorDetail[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // class-validator's ValidationPipe throws an HttpException whose
      // response body looks like: { message: string[] | string, error, statusCode }
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const rawMessage = (exceptionResponse as Record<string, unknown>).message;

        if (Array.isArray(rawMessage)) {
          // Multiple validation errors -> normalise into { field, message }[]
          message = MESSAGES.COMMON.VALIDATION_FAILED;
          errors = rawMessage.map((m) => this.toErrorDetail(String(m)));
        } else {
          message = String(rawMessage);
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      // Unexpected, non-HTTP error - log the full stack for debugging
      // but never expose internals to the client.
      this.logger.error(exception.message, exception.stack);
    }

    // Special-case unmatched routes: Nest/Express auto-throws a 404 with
    // a message like "Cannot GET /abcd". We override it with the exact
    // shape required by the spec so unknown-route errors are friendly
    // and consistent with every other error response.
    if (status === HttpStatus.NOT_FOUND && !this.isKnownRouteError(exception)) {
      message = MESSAGES.COMMON.NOT_FOUND;
      errors = [
        { field: 'route', message: 'The requested endpoint does not exist.' },
      ];
    }

    if (!errors && status >= 400) {
      errors = [{ field: 'general', message }];
    }

    const body: ApiResponse = {
      success: false,
      message,
      data: null,
      errors,
    };

    this.logger.warn(`${request.method} ${request.url} -> ${status}`);
    response.status(status).json(body);
  }

  /**
   * Distinguishes a domain-level 404 (e.g. "Task not found" thrown
   * deliberately by TasksService) from Express/Nest's automatic
   * "Cannot GET /some/unmatched/path" router-miss error. Only the
   * latter should be rewritten into the generic "route not found"
   * shape - a deliberate NotFoundException should keep its own message.
   */
  private isKnownRouteError(exception: unknown): boolean {
    if (!(exception instanceof HttpException)) return true;
    const res = exception.getResponse();
    const msg =
      typeof res === 'string'
        ? res
        : ((res as Record<string, unknown>)?.message as string) ?? '';
    return !String(msg).startsWith('Cannot ');
  }

  /**
   * Best-effort attempt to pull a field name out of a class-validator
   * message such as "email must be a valid email". Falls back to a
   * generic "field" bucket when no pattern is recognised.
   */
  private toErrorDetail(message: string): ApiErrorDetail {
    const [firstWord] = message.split(' ');
    return { field: firstWord || 'field', message };
  }
}

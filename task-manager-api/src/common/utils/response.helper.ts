import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Controllers should never hand-build `{ success, message, data, errors }`
 * objects inline - that leads to typos and inconsistent shapes across
 * the codebase. `ResponseHelper` is the single reusable utility every
 * controller calls to build a SUCCESS response.
 *
 * Errors are handled separately by `HttpExceptionFilter`
 * (common/filters/http-exception.filter.ts) so that even thrown
 * exceptions come back in this exact same shape.
 */
export class ResponseHelper {
  /**
   * Builds a standard "success" API response envelope.
   * @param message Human readable success message.
   * @param data    Payload to return to the client (defaults to null).
   */
  static success<T>(message: string, data: T | null = null): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      errors: null,
    };
  }
}

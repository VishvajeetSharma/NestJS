/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The spec requires EVERY endpoint (success or failure) to return the
 * exact same JSON shape:
 *
 *   { success, message, data, errors }
 *
 * Declaring that shape once as a TypeScript interface lets every part
 * of the codebase (ResponseHelper, exception filters, interceptors)
 * agree on the same contract at compile time.
 */
export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiErrorDetail[] | null;
}

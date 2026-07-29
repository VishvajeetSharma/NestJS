import { registerAs } from '@nestjs/config';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Centralises every "general application" environment variable (port,
 * node environment, upload path) behind a single typed accessor.
 *
 * Using `registerAs` (a NestJS Config feature) namespaces this config
 * under the key "app", so anywhere in the app we can inject it via
 * `ConfigService.get('app.port')` instead of scattering
 * `process.env.PORT` calls across the codebase. This keeps environment
 * variable access in ONE place, which makes the app easier to test,
 * refactor and reason about (Single Responsibility Principle).
 */
export default registerAs('app', () => ({
  // The port the HTTP server binds to.
  port: parseInt(process.env.PORT ?? '3000', 10),

  // Current runtime environment - toggles things like verbose logging.
  nodeEnv: process.env.NODE_ENV ?? 'development',

  // Relative folder (from project root) where profile pictures are stored.
  // Kept configurable so deployments can point to a different disk/volume.
  uploadPath: process.env.UPLOAD_PATH ?? 'uploads/profile',
}));

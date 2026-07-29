import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Thin wrapper around Passport's built-in `AuthGuard('jwt')`. Every
 * Task endpoint is decorated with `@UseGuards(JwtAuthGuard)`, which
 * triggers `JwtStrategy.validate()` before the route handler runs.
 *
 * Overriding `handleRequest` lets us throw a clean, spec-compliant 401
 * (via the global exception filter) instead of Passport's default
 * generic error when a token is missing/invalid/expired.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: unknown,
    user: TUser,
    _info: unknown,
    _context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Invalid or expired authentication token.');
    }
    return user;
  }
}

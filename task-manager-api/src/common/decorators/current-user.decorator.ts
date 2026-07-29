import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * `JwtStrategy.validate()` attaches the decoded JWT payload to
 * `request.user` (standard Passport behaviour). Without this decorator,
 * every controller method would need to manually pull
 * `req.user` out of the raw Express request, which is repetitive and
 * leaks Express-specific typing into controllers.
 *
 * `@CurrentUser()` lets controllers simply declare:
 *   create(@CurrentUser() user: JwtPayload, ...)
 * which is far more readable and keeps controllers framework-agnostic.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);

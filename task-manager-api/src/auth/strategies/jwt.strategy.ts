import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UsersService } from '../../users/users.service';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Registers a Passport "jwt" strategy that:
 *   1. Extracts the token from the `Authorization: Bearer <token>` header.
 *   2. Verifies its signature/expiry using the shared JWT secret.
 *   3. Calls `validate()` with the decoded payload, which re-fetches the
 *      user from the DB to guarantee the account still exists (e.g. it
 *      wasn't deleted after the token was issued).
 *
 * `JwtAuthGuard` (guards/jwt-auth.guard.ts) is what actually triggers
 * this strategy on a per-route basis.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Called automatically by Passport once the token signature/expiry
   * has been verified. Whatever this method returns is attached to
   * `request.user` (see CurrentUser decorator).
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }
    return { sub: user.id, email: user.email };
  }
}

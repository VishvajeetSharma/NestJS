import { registerAs } from '@nestjs/config';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Groups the JWT secret & expiry under the "jwt" namespace so that both
 * the AuthModule (JwtModule.registerAsync) and the JwtStrategy can read
 * consistent, validated values instead of touching `process.env`
 * directly in multiple places.
 */
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET ?? 'default-secret-please-change',
  expiresIn: process.env.JWT_EXPIRES ?? '7d',
}));

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Wires together everything authentication needs:
 *   - `UsersModule` for reading/creating User rows.
 *   - `PassportModule` + `JwtStrategy` for verifying bearer tokens on
 *     protected routes.
 *   - `JwtModule.registerAsync` for *signing* new tokens at
 *     register/login time, configured from the `jwt` config namespace
 *     rather than hardcoded values.
 */
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}

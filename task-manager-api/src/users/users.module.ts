import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Registers the `User` entity's repository with Nest's DI container and
 * exports `UsersService` so AuthModule (registration/login) and
 * JwtStrategy (token validation) can both inject it without each
 * redefining their own repository access.
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

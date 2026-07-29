import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Repository-pattern wrapper around the `User` entity. AuthService and
 * JwtStrategy both need to read/write users, but neither should talk to
 * TypeORM's `Repository<User>` directly - that would scatter query
 * logic across modules and violate the Single Responsibility
 * Principle. Every User-related query lives here, in one place.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Finds a user by their unique email address, or null if none exists. */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /** Finds a user by primary key (UUID), or null if none exists. */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /** Persists a brand-new user row. Password must already be hashed. */
  async create(data: {
    name: string;
    email: string;
    password: string;
    profilePicture: string | null;
  }): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}

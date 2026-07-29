import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MESSAGES } from '../common/constants/messages.constant';
import { User } from '../users/entities/user.entity';

// Number of bcrypt salt rounds. 10-12 is the industry-standard sweet
// spot between hashing cost (security) and login-request latency.
const BCRYPT_SALT_ROUNDS = 10;

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Contains ALL authentication business logic (password hashing, email
 * uniqueness checks, credential verification, JWT issuance). Kept
 * separate from AuthController so the controller stays a thin
 * HTTP-only layer (parsing the request, calling the service, shaping
 * the response) - a direct application of the Single Responsibility
 * Principle.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user:
   *   1. Rejects duplicate emails with 409.
   *   2. Hashes the password with bcrypt - the plaintext password is
   *      NEVER stored or logged.
   *   3. Persists the user (with an optional uploaded profile picture
   *      path).
   *   4. Immediately issues a JWT so the user is "logged in" right
   *      after registering, per the spec.
   */
  async register(
    dto: RegisterDto,
    profilePicturePath: string | null,
  ): Promise<{ token: string; user: Record<string, unknown> }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      profilePicture: profilePicturePath,
    });

    const token = this.generateToken(user);
    return { token, user: this.toSafeUser(user) };
  }

  /**
   * Authenticates an existing user with email + password.
   * Deliberately returns the SAME 401 message whether the email doesn't
   * exist or the password is wrong, so an attacker cannot use the error
   * message to enumerate valid accounts.
   */
  async login(dto: LoginDto): Promise<{ token: string; user: Record<string, unknown> }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(user);
    return { token, user: this.toSafeUser(user) };
  }

  /** Signs a JWT embedding the user's id (as `sub`) and email. */
  private generateToken(user: User): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      },
    );
  }

  /**
   * Strips sensitive fields (password) from a User entity before it's
   * ever sent back in an HTTP response. Uses class-transformer's
   * `@Exclude()` decorator already present on `User.password`.
   */
  private toSafeUser(user: User): Record<string, unknown> {
    // `instanceToPlain` walks the entity's own class-transformer
    // decorators (including `@Exclude()` on `password`) and returns a
    // plain object safe to serialise straight into a JSON response.
    return instanceToPlain(user);
  }
}

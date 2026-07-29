import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Validates the POST /auth/login body. Password length is
 * intentionally NOT re-validated here beyond "not empty" - login should
 * fail with a generic 401 for wrong credentials rather than leaking
 * password-policy details to an attacker probing the endpoint.
 */
export class LoginDto {
  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;
}

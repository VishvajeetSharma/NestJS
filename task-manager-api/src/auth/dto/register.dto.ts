import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Defines & validates the shape of the POST /auth/register body.
 * `ValidationPipe` (registered globally in main.ts) automatically
 * rejects any request that doesn't satisfy these rules with a 400,
 * before the request ever reaches AuthController/AuthService.
 *
 * The profile picture itself is NOT part of this DTO - Multer parses
 * `multipart/form-data` file uploads separately and hands the file to
 * the controller via `@UploadedFile()`, while the text fields
 * (name/email/password) still arrive as regular form fields validated
 * here.
 */
export class RegisterDto {
  @IsNotEmpty({ message: 'name should not be empty' })
  name: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  email: string;

  @MinLength(8, { message: 'password must be at least 8 characters long' })
  password: string;
}

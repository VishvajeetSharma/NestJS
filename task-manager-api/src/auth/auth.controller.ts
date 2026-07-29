import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseHelper } from '../common/utils/response.helper';
import { MESSAGES } from '../common/constants/messages.constant';
import { multerConfig } from '../uploads/multer.config';
import { ApiResponse } from '../common/interfaces/api-response.interface';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Thin HTTP layer for authentication. Every method here does three
 * things only: (1) receive/validate the request, (2) delegate to
 * AuthService, (3) shape the response with ResponseHelper. All actual
 * business logic (hashing, JWT signing, uniqueness checks) lives in
 * AuthService.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * POST /auth/register
   * Accepts `multipart/form-data` so an optional profile picture can be
   * uploaded alongside the text fields. The upload destination/limits
   * are configured dynamically from `UPLOAD_PATH` via multerConfig().
   */
  @Post('register')
  @UseInterceptors(
    FileInterceptor(
      'profilePicture',
      multerConfig(process.env.UPLOAD_PATH ?? 'uploads/profile'),
    ),
  )
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ApiResponse> {
    const uploadPath = this.configService.get<string>('app.uploadPath');
    // Store only the relative, web-servable path - never the absolute
    // filesystem path - so it can be safely returned to clients and
    // resolved against the static file server registered in main.ts.
    const profilePicturePath = file ? `/${uploadPath}/${file.filename}` : null;

    const { token, user } = await this.authService.register(dto, profilePicturePath);

    return ResponseHelper.success(MESSAGES.AUTH.REGISTER_SUCCESS, {
      token,
      user,
    });
  }

  /**
   * POST /auth/login
   * Plain JSON endpoint - no file upload involved.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<ApiResponse> {
    const { token, user } = await this.authService.login(dto);
    return ResponseHelper.success(MESSAGES.AUTH.LOGIN_SUCCESS, { token, user });
  }
}

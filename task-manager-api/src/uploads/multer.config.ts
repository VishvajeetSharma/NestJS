import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  PROFILE_IMAGE_ALLOWED_MIME_TYPES,
  PROFILE_IMAGE_MAX_SIZE_BYTES,
} from '../common/constants/upload.constant';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Encapsulates every Multer concern (where files land on disk, how
 * they're named, which mimetypes/sizes are accepted) in one reusable
 * factory. AuthController's `@UseInterceptors(FileInterceptor('profilePicture', multerConfig(...)))`
 * pulls this in rather than duplicating Multer options inline.
 *
 * Files are named with a fresh UUID (never the client-supplied
 * filename) to avoid path traversal attacks and filename collisions.
 */
export const multerConfig = (uploadPath: string) => ({
  storage: diskStorage({
    destination: join(process.cwd(), uploadPath),
    filename: (_req, file, callback) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
      callback(null, uniqueName);
    },
  }),
  limits: {
    fileSize: PROFILE_IMAGE_MAX_SIZE_BYTES,
  },
  fileFilter: (
    _req: unknown,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!PROFILE_IMAGE_ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      callback(
        new BadRequestException(
          'Only jpg, jpeg, png and webp image files are allowed.',
        ),
        false,
      );
      return;
    }
    callback(null, true);
  },
});

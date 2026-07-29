/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Keeps every "magic number/string" related to profile picture uploads
 * in one place so the Multer configuration and any validation pipes
 * stay in sync.
 */
export const PROFILE_IMAGE_ALLOWED_MIME_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
];

// 5 MB, expressed in bytes, as required by the spec.
export const PROFILE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

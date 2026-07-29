/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Centralises user-facing text so messages stay consistent and are easy
 * to change/translate later without hunting through every service file.
 */
export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    EMAIL_EXISTS: 'An account with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
  },
  TASK: {
    CREATE_SUCCESS: 'Task created successfully.',
    UPDATE_SUCCESS: 'Task updated successfully.',
    DELETE_SUCCESS: 'Task deleted successfully.',
    LIST_SUCCESS: 'Tasks fetched successfully.',
    DETAIL_SUCCESS: 'Task fetched successfully.',
    ALREADY_EXISTS: 'Task name already exists.',
    NOT_FOUND: 'Task not found.',
  },
  COMMON: {
    NOT_FOUND: 'API endpoint not found.',
    INTERNAL_ERROR: 'Something went wrong. Please try again later.',
    VALIDATION_FAILED: 'Validation failed.',
    HEALTH_OK: 'Server is running.',
  },
};

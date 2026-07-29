import { Controller, Get } from '@nestjs/common';
import { ResponseHelper } from '../common/utils/response.helper';
import { MESSAGES } from '../common/constants/messages.constant';
import { ApiResponse } from '../common/interfaces/api-response.interface';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Provides a lightweight, unauthenticated `GET /health` endpoint that
 * load balancers, uptime monitors, or container orchestrators (e.g. a
 * Kubernetes liveness probe) can poll to confirm the process is up and
 * responding, without touching the database or any business logic.
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): ApiResponse {
    return ResponseHelper.success(MESSAGES.COMMON.HEALTH_OK, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}

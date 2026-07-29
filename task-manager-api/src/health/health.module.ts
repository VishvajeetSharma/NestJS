import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * Isolates the health-check endpoint in its own module so it has zero
 * dependencies on Auth/Users/Tasks - it must keep working even if
 * those modules fail to initialise.
 */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}

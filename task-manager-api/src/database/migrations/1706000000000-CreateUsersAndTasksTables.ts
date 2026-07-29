import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * WHY THIS FILE EXISTS
 * --------------------
 * The very first migration for this project. Creates the `users` and
 * `tasks` tables from scratch, including:
 *   - the `uuid-ossp` Postgres extension (needed for `uuid_generate_v4()`)
 * - a UNIQUE constraint on `users.email`
 * - a composite UNIQUE index on `tasks(userId, taskName)` so the same
 *   user can never have two tasks with the same name, while different
 *   users can freely reuse task names (e.g. two users can each have a
 *   "Gym" task)
 * - a foreign key from tasks.userId -> users.id with ON DELETE CASCADE,
 *   so deleting a user cleans up their tasks automatically.
 *
 * Migrations are run with `npm run migration:run`. NEVER edit an
 * already-applied migration file - create a new one instead.
 */
export class CreateUsersAndTasksTables1706000000000 implements MigrationInterface {
  name = 'CreateUsersAndTasksTables1706000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Required so `uuid_generate_v4()` is available for PK defaults.
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar NOT NULL,
        "profilePicture" varchar,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "date" date NOT NULL,
        "taskName" varchar(255) NOT NULL,
        "description" text,
        "estimatedDurationMinutes" integer NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tasks_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_userId" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Composite uniqueness: (userId, taskName) - the core business rule
    // "a task name must be unique per user".
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_tasks_userId_taskName"
      ON "tasks" ("userId", "taskName")
    `);

    // Speeds up "list my tasks, newest first" pagination queries.
    await queryRunner.query(`
      CREATE INDEX "IDX_tasks_userId_createdAt"
      ON "tasks" ("userId", "createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_tasks_userId_createdAt"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_tasks_userId_taskName"');
    await queryRunner.query('DROP TABLE IF EXISTS "tasks"');
    await queryRunner.query('DROP TABLE IF EXISTS "users"');
  }
}

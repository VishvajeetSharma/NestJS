# Task Manager API

A production-ready **Task Manager Backend API** built with **NestJS**, **TypeScript**, **PostgreSQL**, and **TypeORM**. Includes JWT authentication, bcrypt password hashing, profile picture uploads, migrations (no `synchronize: true`), a consistent response envelope, global error handling, and a Postman collection.

---

## 1. Tech Stack

| Concern            | Library                     |
|---------------------|-----------------------------|
| Framework           | NestJS                      |
| Language            | TypeScript                  |
| Database            | PostgreSQL                  |
| ORM                 | TypeORM (migrations only)   |
| Auth                | JWT + Passport              |
| Password hashing    | bcrypt                      |
| Validation          | class-validator / class-transformer |
| File uploads        | Multer                      |
| Security headers    | Helmet                      |
| Compression         | compression                 |
| Access logging      | Morgan                      |
| Unique filenames    | uuid                        |

No Docker is used - everything runs directly with Node.js against a PostgreSQL instance you control.

---

## 2. Project Structure

```
src/
  main.ts                  # Bootstrap: helmet, cors, compression, morgan, global pipes/filters
  app.module.ts             # Root module - wires config, TypeORM, static files, feature modules

  config/                   # Typed env-var namespaces (app, database, jwt)
  database/
    data-source.ts           # TypeORM CLI DataSource (migrations only)
    typeorm.config.ts        # Runtime TypeOrmModule factory
    migrations/               # Versioned schema migrations

  common/
    constants/                # Shared messages & upload constants
    decorators/                # @CurrentUser()
    filters/                   # Global HttpExceptionFilter
    interceptors/               # LoggingInterceptor
    interfaces/                  # ApiResponse, JwtPayload
    utils/                       # ResponseHelper

  uploads/
    multer.config.ts          # Multer storage/fileFilter factory

  users/
    entities/user.entity.ts
    users.service.ts
    users.module.ts

  auth/
    dto/                       # RegisterDto, LoginDto
    strategies/jwt.strategy.ts
    guards/jwt-auth.guard.ts
    auth.service.ts
    auth.controller.ts
    auth.module.ts

  tasks/
    entities/task.entity.ts
    dto/                       # CreateTaskDto, UpdateTaskDto, PaginationQueryDto
    tasks.service.ts
    tasks.controller.ts
    tasks.module.ts

  health/
    health.controller.ts
    health.module.ts

uploads/profile/             # Uploaded profile pictures land here, served at /uploads/profile/*
TaskManager.postman_collection.json
```

Every file contains a header comment explaining **why it exists**, and every class/method has inline comments explaining **what it does and why**.

---

## 3. Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy the example environment file and fill in real values
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=task_manager

JWT_SECRET=replace-with-a-long-random-string
JWT_EXPIRES=7d

UPLOAD_PATH=uploads/profile
```

---

## 4. Database Setup

1. Create the database (once):

   ```bash
   createdb task_manager
   # or, from psql:
   # CREATE DATABASE task_manager;
   ```

2. Run migrations (creates `users` and `tasks` tables - **`synchronize` is always `false`**, so nothing happens automatically until you run this):

   ```bash
   npm run migration:run
   ```

3. To roll back the last migration:

   ```bash
   npm run migration:revert
   ```

4. To generate a new migration after changing an entity:

   ```bash
   npm run migration:generate -- src/database/migrations/YourMigrationName
   ```

---

## 5. Running the App

```bash
# Development (watch mode, auto-reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The server starts on `http://localhost:3000` (or whatever `PORT` you set). Check it's alive:

```bash
curl http://localhost:3000/health
```

---

## 6. API Documentation

All responses share the same envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": {},
  "errors": null
}
```

### Auth

#### `POST /auth/register`
`multipart/form-data` (so a profile picture can be attached).

| Field           | Type   | Required |
|------------------|--------|----------|
| name             | string | yes      |
| email            | string | yes      |
| password         | string | yes (min 8 chars) |
| profilePicture   | file   | no (jpg/jpeg/png/webp, max 5MB) |

Success `201`-equivalent (`200` with `success:true`):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": { "token": "...", "user": { "id": "...", "name": "...", "email": "..." } },
  "errors": null
}
```
`409` if the email is already registered.

#### `POST /auth/login`
JSON body: `{ "email": "...", "password": "..." }`
Returns a token exactly like register. `401` on wrong credentials.

### Tasks (all require `Authorization: Bearer <token>`)

#### `POST /tasks`
```json
{
  "date": "2026-07-28",
  "taskName": "Gym",
  "description": "Leg day",
  "estimatedHours": 1,
  "estimatedMinutes": 30
}
```
`409` if this user already has a task named "Gym".

#### `GET /tasks?page=1&limit=10`
Returns only the logged-in user's tasks, newest first, paginated.

#### `GET /tasks/:id`
Returns a single task (`404` if it doesn't exist or belongs to someone else).

#### `PATCH /tasks/:id`
Editable fields only: `date`, `description`, `estimatedHours`, `estimatedMinutes`. Sending `taskName` is rejected with `400` (it can never be changed). `404` if not found.

#### `DELETE /tasks/:id`
Deletes the task if it belongs to the logged-in user. `404` otherwise.

### Bonus

#### `GET /health`
```json
{
  "success": true,
  "message": "Server is running.",
  "data": { "status": "OK", "timestamp": "...", "uptime": 123.45 },
  "errors": null
}
```

#### Unknown routes
Any undefined route returns a `404` in the standard envelope:
```json
{
  "success": false,
  "message": "API endpoint not found.",
  "data": null,
  "errors": [{ "field": "route", "message": "The requested endpoint does not exist." }]
}
```

---

## 7. Postman

Import `TaskManager.postman_collection.json` into Postman. It includes:

- Register
- Login
- Create Task
- List Tasks
- Get Task by Id
- Update Task
- Delete Task
- Health Check

The collection uses a collection variable `baseUrl` (default `http://localhost:3000`) and automatically stores the JWT returned by Login/Register into a `token` variable, which every Task request reuses via `Authorization: Bearer {{token}}`.

---

## 8. Error Codes

| Code | Meaning                                   |
|------|--------------------------------------------|
| 400  | Validation failed / bad file upload          |
| 401  | Missing/invalid token, wrong credentials     |
| 403  | (reserved for future role-based rules)       |
| 404  | Resource or route not found                  |
| 409  | Duplicate email / duplicate task name        |
| 500  | Unexpected server error                       |

---

## 9. Design Notes

- **Repository pattern**: every entity's DB access is wrapped in a dedicated service (`UsersService`, `TasksService`) - controllers never touch TypeORM directly.
- **SOLID**: each class has one reason to change (controllers = HTTP shaping, services = business rules, entities = schema, DTOs = validation).
- **Security**: passwords are bcrypt-hashed (never logged/returned), JWTs expire, Helmet sets protective headers, uploaded filenames are UUID-randomised to prevent path traversal/collisions.
- **Data isolation**: every Task query is scoped by `userId` at the SQL level, so one user can never read, edit, or delete another user's task - not even by guessing an id.

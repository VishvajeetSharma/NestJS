# Phase 2: Core Architecture

> **Level:** Beginner → Intermediate
> **Interview Importance:** ⭐⭐⭐⭐⭐
> **Prerequisite:** TypeScript, JavaScript classes, decorators, and basic NestJS knowledge

---

# Table of Contents

4. Modules

  * Root Module
  * Feature Module
  * Shared Module
  * Global Module
  * Dynamic Module
  * Imports and Exports

5. Controllers

  * HTTP Methods
  * Route Parameters
  * Query Parameters
  * Request Body
  * Headers
  * Decorators

6. Providers

  * `@Injectable()`
  * Singleton Scope
  * Request Scope
  * Transient Scope

7. Services

  * Business Logic
  * Service Communication
  * Repository Injection

8. Dependency Injection

  * DI Container
  * Constructor Injection
  * Injection Tokens
  * Custom Providers
  * Factory Providers
  * Existing Providers
  * Value Providers

9. Custom Providers

10. Interview Questions

11. Quick Revision

12. Final Architecture

---

# 4. Modules

A **module** is a class decorated with `@Module()`.

Modules organize an application into logical and reusable units.

Example:

```ts
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}
```

The `@Module()` decorator accepts metadata:

```ts
@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
```

---

## Module Metadata

### `imports`

Imports other modules whose exported providers are needed.

```ts
@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

---

### `controllers`

Registers controllers that belong to the module.

```ts
@Module({
  controllers: [UsersController],
})
export class UsersModule {}
```

---

### `providers`

Registers services and other providers.

```ts
@Module({
  providers: [UsersService],
})
export class UsersModule {}
```

---

### `exports`

Makes providers available to modules that import this module.

```ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

---

## 4.1 Root Module

The **Root Module** is the starting point of the NestJS application.

It is usually named:

```text
AppModule
```

Example:

```ts
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

The root module connects all feature modules.

Application flow:

```text
main.ts
   │
   ▼
AppModule
   │
   ├── UsersModule
   ├── AuthModule
   ├── TasksModule
   └── DatabaseModule
```

### Important Points

* Every NestJS application has at least one root module.
* The root module is passed to `NestFactory.create()`.
* It acts as the main application entry module.

Example:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
```

---

## 4.2 Feature Module

A **Feature Module** groups code related to one business feature.

Examples:

```text
UsersModule
AuthModule
TasksModule
ProductsModule
PaymentsModule
```

Example:

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Folder structure:

```text
users/
├── users.module.ts
├── users.controller.ts
├── users.service.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
└── entities/
    └── user.entity.ts
```

### Benefits

* Better code organization
* Easy maintenance
* Reusable features
* Clear separation of responsibilities
* Easier testing

---

## 4.3 Shared Module

A **Shared Module** contains reusable providers used by multiple modules.

Example:

```text
SharedModule
├── LoggerService
├── EmailService
└── FileService
```

```ts
import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedModule {}
```

Use it in another module:

```ts
@Module({
  imports: [SharedModule],
})
export class UsersModule {}
```

Now `LoggerService` can be injected into providers inside `UsersModule`.

```ts
@Injectable()
export class UsersService {
  constructor(
    private readonly loggerService: LoggerService,
  ) {}
}
```

### Important

A provider must be added to `exports` before another module can use it.

---

## 4.4 Global Module

A **Global Module** makes its exported providers available throughout the application without importing the module repeatedly.

Use `@Global()`:

```ts
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
```

Now `ConfigService` can be injected into providers in other modules without importing `ConfigModule` everywhere.

```ts
@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
  ) {}
}
```

### Use Global Modules Carefully

Good use cases:

* Configuration
* Application-wide logging
* Database connection
* Shared infrastructure services

Avoid making every module global because it:

* Hides dependencies
* Makes code harder to understand
* Increases coupling
* Makes testing more difficult

---

## 4.5 Dynamic Module

A **Dynamic Module** is a module configured at runtime.

It is useful when module configuration depends on:

* Environment variables
* User-provided options
* Database configuration
* External service configuration

Example:

```ts
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class DatabaseModule {
  static forRoot(
    connectionString: string,
  ): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_URL',
          useValue: connectionString,
        },
      ],
      exports: ['DATABASE_URL'],
    };
  }
}
```

Use it:

```ts
@Module({
  imports: [
    DatabaseModule.forRoot(
      'postgresql://localhost:5432/mydb',
    ),
  ],
})
export class AppModule {}
```

### Dynamic Module Structure

```ts
{
  module: DatabaseModule,
  imports: [],
  providers: [],
  exports: [],
  controllers: [],
  global: false,
}
```

### Common Dynamic Module Methods

```ts
forRoot()
forRootAsync()
register()
registerAsync()
```

Examples:

```ts
ConfigModule.forRoot();

JwtModule.register({
  secret: process.env.JWT_SECRET,
});

JwtModule.registerAsync({
  useFactory: () => ({
    secret: process.env.JWT_SECRET,
  }),
});
```

### `forRoot()` vs `forRootAsync()`

| `forRoot()`                            | `forRootAsync()`                            |
| -------------------------------------- | ------------------------------------------- |
| Uses direct configuration              | Uses asynchronous or injected configuration |
| Simple setup                           | Advanced setup                              |
| Configuration is available immediately | Can inject other services                   |
| Good for static values                 | Good for environment-based configuration    |

---

## 4.6 Imports and Exports

NestJS modules have encapsulation.

A provider belongs to its module by default.

Example:

```ts
@Module({
  providers: [UsersService],
})
export class UsersModule {}
```

`UsersService` is available only inside `UsersModule`.

To use it outside the module:

### Step 1: Export the provider

```ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

### Step 2: Import the module

```ts
@Module({
  imports: [UsersModule],
})
export class AuthModule {}
```

### Step 3: Inject the service

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}
}
```

### Flow

```text
UsersModule
     │
     │ exports UsersService
     ▼
AuthModule
     │
     │ imports UsersModule
     ▼
AuthService
     │
     │ injects UsersService
     ▼
UsersService
```

### Important Rule

> Import a module, not an individual service.

Correct:

```ts
@Module({
  imports: [UsersModule],
})
export class AuthModule {}
```

Incorrect:

```ts
@Module({
  imports: [UsersService],
})
export class AuthModule {}
```

---

# 5. Controllers

A **Controller** handles incoming HTTP requests and returns responses.

Controllers should mainly handle:

* Routes
* Request data
* Calling services
* Returning responses

Controllers should not contain complex business logic.

Example:

```ts
import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return {
      message: 'All users',
    };
  }
}
```

Request:

```http
GET /users
```

Response:

```json
{
  "message": "All users"
}
```

---

## Controller and Service Flow

```text
HTTP Request
      │
      ▼
UsersController
      │
      ▼
UsersService
      │
      ▼
Repository
      │
      ▼
Database
      │
      ▼
Response
```

Example:

```ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

Service:

```ts
@Injectable()
export class UsersService {
  findAll() {
    return [
      {
        id: 1,
        name: 'John',
      },
    ];
  }
}
```

---

## 5.1 HTTP Method Decorators

| Decorator   | HTTP Method | Purpose                   |
| ----------- | ----------- | ------------------------- |
| `@Get()`    | GET         | Read data                 |
| `@Post()`   | POST        | Create data               |
| `@Put()`    | PUT         | Replace complete resource |
| `@Patch()`  | PATCH       | Partially update resource |
| `@Delete()` | DELETE      | Delete data               |

---

## GET

```ts
@Get()
findAll() {
  return this.usersService.findAll();
}
```

Request:

```http
GET /users
```

---

## POST

```ts
@Post()
create(
  @Body() createUserDto: CreateUserDto,
) {
  return this.usersService.create(
    createUserDto,
  );
}
```

Request:

```http
POST /users
```

Body:

```json
{
  "name": "John",
  "email": "john@example.com"
}
```

---

## PUT

`PUT` usually replaces the complete resource.

```ts
@Put(':id')
replace(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
) {
  return this.usersService.replace(
    id,
    updateUserDto,
  );
}
```

Request:

```http
PUT /users/10
```

---

## PATCH

`PATCH` updates only selected fields.

```ts
@Patch(':id')
update(
  @Param('id') id: string,
  @Body() updateUserDto: UpdateUserDto,
) {
  return this.usersService.update(
    id,
    updateUserDto,
  );
}
```

Request:

```http
PATCH /users/10
```

Body:

```json
{
  "name": "Updated John"
}
```

---

## DELETE

```ts
@Delete(':id')
remove(
  @Param('id') id: string,
) {
  return this.usersService.remove(id);
}
```

Request:

```http
DELETE /users/10
```

---

## 5.2 Route Parameters — `@Param()`

Route parameters are values inside the URL path.

Route:

```ts
@Get(':id')
findOne(
  @Param('id') id: string,
) {
  return {
    id,
  };
}
```

Request:

```http
GET /users/10
```

Response:

```json
{
  "id": "10"
}
```

Get all parameters:

```ts
@Get(':userId/posts/:postId')
findPost(
  @Param() params: {
    userId: string;
    postId: string;
  },
) {
  return params;
}
```

Request:

```http
GET /users/5/posts/20
```

---

## 5.3 Query Parameters — `@Query()`

Query parameters are usually used for:

* Pagination
* Filtering
* Searching
* Sorting

Example:

```ts
@Get()
findAll(
  @Query('page') page: string,
  @Query('limit') limit: string,
) {
  return {
    page,
    limit,
  };
}
```

Request:

```http
GET /users?page=1&limit=10
```

Response:

```json
{
  "page": "1",
  "limit": "10"
}
```

Get all query parameters:

```ts
@Get()
findAll(
  @Query() query: Record<string, string>,
) {
  return query;
}
```

---

## 5.4 Request Body — `@Body()`

`@Body()` reads data sent in the request body.

```ts
@Post()
create(
  @Body() createUserDto: CreateUserDto,
) {
  return createUserDto;
}
```

DTO:

```ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

Request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "password123"
}
```

Read one property:

```ts
@Post()
create(
  @Body('email') email: string,
) {
  return {
    email,
  };
}
```

---

## 5.5 Request Headers — `@Headers()`

Read a specific header:

```ts
@Get()
getProfile(
  @Headers('authorization')
  authorization: string,
) {
  return {
    authorization,
  };
}
```

Request:

```http
Authorization: Bearer token-value
```

Read all headers:

```ts
@Get()
getHeaders(
  @Headers() headers: Record<string, string>,
) {
  return headers;
}
```

---

## 5.6 Common Controller Decorators

| Decorator       | Purpose                     |
| --------------- | --------------------------- |
| `@Controller()` | Defines a controller        |
| `@Get()`        | Handles GET requests        |
| `@Post()`       | Handles POST requests       |
| `@Put()`        | Handles PUT requests        |
| `@Patch()`      | Handles PATCH requests      |
| `@Delete()`     | Handles DELETE requests     |
| `@Body()`       | Reads request body          |
| `@Param()`      | Reads route parameters      |
| `@Query()`      | Reads query parameters      |
| `@Headers()`    | Reads request headers       |
| `@Req()`        | Accesses the raw request    |
| `@Res()`        | Accesses the raw response   |
| `@HttpCode()`   | Changes the response status |
| `@Header()`     | Adds a response header      |

Example:

```ts
@Post()
@HttpCode(201)
create(
  @Body() dto: CreateUserDto,
) {
  return this.usersService.create(dto);
}
```

---

# 6. Providers

A **Provider** is a dependency that NestJS can create and inject.

Examples:

* Services
* Repositories
* Factories
* Configuration objects
* Database clients
* Custom providers

Example:

```ts
@Injectable()
export class UsersService {}
```

Register it:

```ts
@Module({
  providers: [UsersService],
})
export class UsersModule {}
```

---

## 6.1 `@Injectable()`

`@Injectable()` tells NestJS that a class can participate in dependency injection.

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

Inject it:

```ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
}
```

NestJS creates the service and injects it automatically.

---

## 6.2 Singleton Scope

Singleton is the default provider scope.

Only one instance is created and reused throughout the application.

```ts
@Injectable()
export class UsersService {}
```

Concept:

```text
Application starts
       │
       ▼
Create one UsersService instance
       │
       ├── Request 1 → same instance
       ├── Request 2 → same instance
       └── Request 3 → same instance
```

### Advantages

* Better performance
* Lower memory usage
* Suitable for most services

### Important

Do not store request-specific user data in singleton service properties.

Bad:

```ts
@Injectable()
export class UsersService {
  currentUserId: string;
}
```

Multiple requests may share the same instance.

---

## 6.3 Request Scope

A new provider instance is created for every HTTP request.

```ts
import {
  Injectable,
  Scope,
} from '@nestjs/common';

@Injectable({
  scope: Scope.REQUEST,
})
export class RequestService {}
```

Flow:

```text
Request 1
   │
   ▼
New RequestService instance

Request 2
   │
   ▼
New RequestService instance
```

Use cases:

* Request-specific context
* Tenant information
* Request-specific logging
* Per-request user context

### Disadvantage

* More memory usage
* More object creation
* Can reduce performance

Use request scope only when required.

---

## 6.4 Transient Scope

A new instance is created every time the provider is injected.

```ts
@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService {}
```

Example:

```ts
@Injectable()
export class UsersService {
  constructor(
    private readonly logger: LoggerService,
  ) {}
}
```

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly logger: LoggerService,
  ) {}
}
```

Each consumer receives a separate instance.

---

## Provider Scope Comparison

| Scope     | Instance Creation                |
| --------- | -------------------------------- |
| Singleton | One instance for the application |
| Request   | One instance per request         |
| Transient | One instance per injection       |

| Scope     | Performance | Common Use                     |
| --------- | ----------- | ------------------------------ |
| Singleton | Best        | Most services                  |
| Request   | Lower       | Request context                |
| Transient | Lower       | Independent state per consumer |

---

# 7. Services

A **Service** contains business logic.

Business logic includes:

* Creating users
* Validating application rules
* Updating tasks
* Calculating values
* Sending emails
* Communicating with repositories

Example:

```ts
@Injectable()
export class UsersService {
  create(
    createUserDto: CreateUserDto,
  ) {
    return {
      message: 'User created',
      data: createUserDto,
    };
  }
}
```

Controller:

```ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(dto);
  }
}
```

---

## Controller vs Service

| Controller             | Service                        |
| ---------------------- | ------------------------------ |
| Handles HTTP requests  | Handles business logic         |
| Reads request data     | Processes data                 |
| Calls services         | Communicates with repositories |
| Returns HTTP responses | Returns application data       |
| Should remain thin     | Contains application rules     |

Bad:

```ts
@Post()
async create(
  @Body() dto: CreateUserDto,
) {
  // Validation
  // Password hashing
  // Database query
  // Email sending
}
```

Better:

```ts
@Post()
create(
  @Body() dto: CreateUserDto,
) {
  return this.usersService.create(dto);
}
```

---

## 7.1 Service Communication

One service can use another service.

Example:

```text
AuthService
     │
     ▼
UsersService
```

`UsersModule`:

```ts
@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

`AuthModule`:

```ts
@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
```

Inject the service:

```ts
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    return user;
  }
}
```

### Important Rule

To inject a service from another module:

1. Add the service to `providers`.
2. Export the service from its module.
3. Import that module where needed.
4. Inject the service through the constructor.

---

## Circular Dependency

A circular dependency happens when:

```text
UsersService
      │
      ▼
AuthService
      │
      ▼
UsersService
```

Avoid circular dependencies by improving architecture.

If required, NestJS provides `forwardRef()`:

```ts
@Module({
  imports: [
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
```

Use `forwardRef()` carefully. It may indicate tightly coupled modules.

---

## 7.2 Repository Injection

A repository handles database operations.

Example with TypeORM:

```ts
import {
  Injectable,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Repository,
} from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository:
      Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }
}
```

Register the entity:

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

Create:

```ts
async create(
  dto: CreateUserDto,
) {
  const user =
    this.userRepository.create(dto);

  return this.userRepository.save(
    user,
  );
}
```

Find one:

```ts
findByEmail(email: string) {
  return this.userRepository.findOne({
    where: {
      email,
    },
  });
}
```

Update:

```ts
async update(
  id: string,
  dto: UpdateUserDto,
) {
  await this.userRepository.update(
    id,
    dto,
  );

  return this.userRepository.findOne({
    where: {
      id,
    },
  });
}
```

Delete:

```ts
remove(id: string) {
  return this.userRepository.delete(id);
}
```

---

# 8. Dependency Injection

Dependency Injection, or **DI**, is a design pattern where a class receives its dependencies from outside instead of creating them itself.

Without DI:

```ts
class UsersController {
  private usersService =
    new UsersService();
}
```

Problems:

* Tight coupling
* Difficult testing
* Hard to replace dependencies
* Difficult maintenance

With DI:

```ts
class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}
}
```

NestJS creates and injects `UsersService`.

---

## 8.1 DI Container

The **DI Container** is the NestJS system that manages providers.

It:

1. Reads module metadata.
2. Finds providers.
3. Creates provider instances.
4. Resolves dependencies.
5. Injects dependencies.
6. Reuses instances based on scope.

Example:

```ts
@Module({
  providers: [
    UsersService,
  ],
})
export class UsersModule {}
```

NestJS knows that `UsersService` is available.

```ts
@Controller()
export class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}
}
```

NestJS resolves and injects the dependency.

---

## 8.2 Constructor Injection

Constructor injection is the most common DI method in NestJS.

```ts
@Injectable()
export class UsersService {}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}
}
```

NestJS reads the constructor type:

```ts
UsersService
```

Then finds the registered provider and injects it.

### Benefits

* Dependencies are explicit.
* Easy to test.
* Easy to mock.
* Dependencies are available when the class is created.

---

## 8.3 Injection Tokens

An **Injection Token** is a unique key used by NestJS to identify a provider.

Class token:

```ts
@Injectable()
export class UsersService {}
```

The class itself acts as the token.

Custom string token:

```ts
{
  provide: 'DATABASE_CONNECTION',
  useValue: databaseConnection,
}
```

Inject it:

```ts
@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly database: unknown,
  ) {}
}
```

---

## Token Types

### String Token

```ts
const DATABASE = 'DATABASE';

{
  provide: DATABASE,
  useValue: database,
}
```

---

### Symbol Token

```ts
export const DATABASE =
  Symbol('DATABASE');

{
  provide: DATABASE,
  useValue: database,
}
```

Symbols reduce the risk of token-name collisions.

---

### Class Token

```ts
{
  provide: UsersService,
  useClass: UsersService,
}
```

---

# 9. Custom Providers

Custom providers allow you to control how dependencies are created or resolved.

Provider types:

1. Class Provider
2. Value Provider
3. Factory Provider
4. Existing Provider

---

## 9.1 Class Provider — `useClass`

`useClass` tells NestJS which class to instantiate.

```ts
{
  provide: PaymentService,
  useClass: StripePaymentService,
}
```

Inject:

```ts
@Injectable()
export class OrdersService {
  constructor(
    private readonly paymentService:
      PaymentService,
  ) {}
}
```

This is useful when changing implementations.

Example:

```ts
{
  provide: 'PAYMENT_SERVICE',
  useClass:
    StripePaymentService,
}
```

---

## 9.2 Value Provider — `useValue`

`useValue` injects a fixed value, object, or configuration.

```ts
{
  provide: 'APP_CONFIG',
  useValue: {
    appName: 'Task Manager',
    port: 3000,
  },
}
```

Inject:

```ts
@Injectable()
export class AppService {
  constructor(
    @Inject('APP_CONFIG')
    private readonly config: {
      appName: string;
      port: number;
    },
  ) {}
}
```

Use cases:

* Configuration objects
* Constants
* Mock objects
* External clients

---

## 9.3 Factory Provider — `useFactory`

`useFactory` creates a provider using a function.

```ts
{
  provide: 'DATABASE_CONFIG',
  useFactory: () => {
    return {
      host:
        process.env.DB_HOST,
      port: 5432,
    };
  },
}
```

Factory with dependencies:

```ts
{
  provide: 'JWT_CONFIG',
  useFactory: (
    configService: ConfigService,
  ) => ({
    secret:
      configService.get(
        'JWT_SECRET',
      ),
  }),
  inject: [ConfigService],
}
```

### Use Cases

* Dynamic configuration
* Environment variables
* Conditional providers
* Creating SDK clients
* Async initialization

---

## 9.4 Existing Provider — `useExisting`

`useExisting` creates an alias for an existing provider.

```ts
{
  provide: 'USER_SERVICE',
  useExisting: UsersService,
}
```

Both tokens refer to the same instance.

```ts
@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly usersService:
      UsersService,
  ) {}
}
```

### Important

`useExisting` does not create a new instance.

It reuses the existing provider instance.

---

# Custom Provider Comparison

| Provider      | Purpose                                  |
| ------------- | ---------------------------------------- |
| `useClass`    | Use a specific class implementation      |
| `useValue`    | Provide a fixed value or object          |
| `useFactory`  | Create a value dynamically               |
| `useExisting` | Create an alias for an existing provider |

---

# Complete Example

## `users.service.ts`

```ts
import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [
      {
        id: 1,
        name: 'John',
      },
    ];
  }

  findOne(id: string) {
    return {
      id,
      name: 'John',
    };
  }
}
```

---

## `users.controller.ts`

```ts
import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(
      id,
    );
  }
}
```

---

## `users.module.ts`

```ts
import {
  Module,
} from '@nestjs/common';

@Module({
  controllers: [
    UsersController,
  ],
  providers: [
    UsersService,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {}
```

---

## `app.module.ts`

```ts
import {
  Module,
} from '@nestjs/common';

@Module({
  imports: [
    UsersModule,
  ],
})
export class AppModule {}
```

---

# 10. Interview Questions and Answers

## 1. What is a module in NestJS?

A module is a class decorated with `@Module()` that organizes related controllers, providers, and imports. Every NestJS application has a root module.

---

## 2. What is the difference between a Root Module and a Feature Module?

| Root Module                  | Feature Module                 |
| ---------------------------- | ------------------------------ |
| Main application module      | Organizes one business feature |
| Usually `AppModule`          | Example: `UsersModule`         |
| Connects application modules | Contains feature-specific code |

---

## 3. What is a Shared Module?

A shared module contains reusable providers that can be exported and imported by multiple modules.

---

## 4. What is a Global Module?

A global module makes exported providers available throughout the application without importing the module repeatedly.

---

## 5. What is a Dynamic Module?

A dynamic module returns module configuration at runtime and is commonly configured using methods such as `forRoot()` or `register()`.

---

## 6. What is the difference between `imports` and `exports`?

* `imports`: Uses providers exported by another module.
* `exports`: Makes providers available to modules that import the current module.

---

## 7. What is a controller?

A controller handles incoming HTTP requests, extracts request data, calls services, and returns responses.

---

## 8. What is the difference between `PUT` and `PATCH`?

* `PUT`: Usually replaces the complete resource.
* `PATCH`: Updates only selected fields.

---

## 9. What is a provider?

A provider is a dependency managed by the NestJS DI container. Services, repositories, factories, and configuration values can all be providers.

---

## 10. What is the default provider scope?

The default scope is **Singleton**.

One provider instance is generally shared across the application.

---

## 11. What is Dependency Injection?

Dependency Injection is a design pattern in which dependencies are supplied to a class instead of being created manually inside the class.

---

## 12. What is the DI Container?

The DI Container manages providers, creates instances, resolves dependencies, and injects dependencies where required.

---

## 13. What is constructor injection?

Constructor injection receives dependencies through a class constructor.

```ts
constructor(
  private readonly usersService:
    UsersService,
) {}
```

---

## 14. What is an injection token?

An injection token is a unique identifier used by NestJS to locate a provider.

Examples:

```ts
UsersService
'DATABASE_CONNECTION'
Symbol('DATABASE')
```

---

## 15. What is the difference between `useClass` and `useExisting`?

* `useClass`: Creates an instance using the specified class.
* `useExisting`: Creates an alias to an already existing provider.

---

# 11. Quick Revision

```text
Module
├── Organizes application features
├── imports → uses other modules
├── providers → registers dependencies
├── controllers → registers controllers
└── exports → exposes providers

Controller
├── Handles HTTP requests
├── Reads params, query, body, and headers
└── Calls services

Service
├── Contains business logic
├── Communicates with other services
└── Communicates with repositories

Provider
├── Managed by NestJS
├── Injectable dependency
└── Default scope: Singleton

Dependency Injection
├── DI Container manages providers
├── Constructor injection is common
├── Tokens identify providers
└── Custom providers control dependency creation
```

---

# 12. Final Architecture

```text
main.ts
   │
   ▼
AppModule
   │
   ├── UsersModule
   │      │
   │      ├── UsersController
   │      │        │
   │      │        ▼
   │      ├── UsersService
   │      │        │
   │      │        ▼
   │      └── UserRepository
   │
   ├── AuthModule
   │
   └── TasksModule
```

> **Interview Tip:**
> In NestJS, keep controllers thin, place business logic in services, organize related code using modules, and use dependency injection instead of manually creating dependencies.

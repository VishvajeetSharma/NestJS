> # Phase 5 — DTO & Validation
>
> 10. DTO
>
> * Request DTO
>
> * Response DTO
>
> 11. Validation
>
> * `class-validator`
> * `class-transformer`
> * `ValidationPipe`
> * `whitelist`
> * `transform`
> * Common validation decorators

---

# 1. What Is a DTO?

**DTO** stands for **Data Transfer Object**.

A DTO is an object that defines the **shape, type, and validation rules** of data transferred between different layers of an application.

In NestJS, DTOs are commonly used to:

* Validate incoming request data
* Define the expected request body
* Transform request values
* Improve type safety
* Keep controllers clean
* Prevent invalid or unwanted data from reaching services
* Define response structures

## Simple Example

Suppose a user registration API accepts:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password@123"
}
```

We can define a DTO:

```ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

The DTO defines what data the API expects.

---

# 2. Why Do We Use DTOs?

Without a DTO:

```ts
@Post()
create(@Body() body: any) {
  return this.usersService.create(body);
}
```

Problems:

* `body` has the `any` type
* No validation
* Invalid values may reach the database
* Unexpected properties may be accepted
* The API contract is unclear
* Controllers become difficult to maintain

With a DTO:

```ts
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

Benefits:

* Better type safety
* Centralized validation
* Cleaner controller code
* Reusable request contracts
* Easier testing
* Better maintainability
* Improved API documentation

---

# 3. DTO vs Entity

A common interview question is:

> What is the difference between a DTO and an Entity?

| DTO                                      | Entity                                    |
| ---------------------------------------- | ----------------------------------------- |
| Defines data transferred through the API | Represents a database table or collection |
| Used for request and response contracts  | Used for database persistence             |
| Contains validation rules                | Contains database column definitions      |
| Should expose only required API fields   | May contain internal database fields      |
| Example: `CreateUserDto`                 | Example: `User` entity                    |

## Example

### User Entity

```ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

### Create User DTO

```ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

The entity represents the database model, while the DTO represents the API data contract.

> **Best Practice:** Do not directly use database entities as request DTOs.

---

# 4. Types of DTOs

Common DTO types include:

1. Request DTO
2. Response DTO
3. Create DTO
4. Update DTO
5. Query DTO
6. Authentication DTO

Examples:

```text
CreateUserDto
UpdateUserDto
LoginDto
ChangePasswordDto
UserQueryDto
UserResponseDto
```

---

# 5. Request DTO

A **Request DTO** defines and validates data received from the client.

Request DTOs are commonly used for:

* Request body
* URL query parameters
* Route parameters

## Example: Create User DTO

```ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

Controller:

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

Valid request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password@123"
}
```

Invalid request:

```json
{
  "name": "",
  "email": "invalid-email",
  "password": "123"
}
```

The API should return a validation error before the service is called.

---

# 6. Response DTO

A **Response DTO** defines the data returned by the API.

Response DTOs help:

* Hide sensitive fields
* Keep API responses consistent
* Avoid exposing database internals
* Define a clear API response contract

## Example

Database entity:

```ts
export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string;
}
```

The password and refresh token should not be returned to the client.

Response DTO:

```ts
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
}
```

Service mapping:

```ts
return {
  id: user.id,
  name: user.name,
  email: user.email,
};
```

Response:

```json
{
  "id": "8a2d4c",
  "name": "John",
  "email": "john@example.com"
}
```

> **Security Rule:** Never return passwords, password hashes, refresh tokens, secret keys, or internal security fields in API responses.

---

# 7. `class-validator`

`class-validator` is a library used to validate class properties using decorators.

Install:

```bash
npm install class-validator class-transformer
```

Example:

```ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

Validation rules:

```text
name     → must be a non-empty string
email    → must be a valid email
password → must be a string with at least 8 characters
```

---

# 8. `class-transformer`

`class-transformer` transforms plain JavaScript objects into class instances and converts values into expected types.

Example request:

```http
GET /users?page=2&limit=10
```

Query parameters usually arrive as strings:

```ts
{
  page: "2",
  limit: "10"
}
```

Using `class-transformer`:

```ts
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UserQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number;
}
```

After transformation:

```ts
{
  page: 2,
  limit: 10
}
```

The values become numbers instead of strings.

---

# 9. `ValidationPipe`

`ValidationPipe` is a built-in NestJS pipe that validates incoming data using DTO validation decorators.

It works with:

* `class-validator`
* `class-transformer`

Validation flow:

```text
Client Request
      ↓
Controller
      ↓
ValidationPipe
      ↓
DTO Validation
      ↓
Valid → Service
Invalid → 400 Bad Request
```

---

# 10. Global ValidationPipe

For production applications, validation is usually enabled globally.

`main.ts`:

```ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

Now validation automatically applies to all DTOs.

---

# 11. `whitelist`

The `whitelist` option removes properties that are not defined in the DTO.

Example DTO:

```ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

Request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "isAdmin": true
}
```

With:

```ts
whitelist: true
```

The `isAdmin` property is removed.

Result:

```ts
{
  name: "John",
  email: "john@example.com"
}
```

This helps prevent unwanted properties from reaching the service or database.

---

# 12. `forbidNonWhitelisted`

`forbidNonWhitelisted` throws an error instead of silently removing unknown properties.

Configuration:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

Request:

```json
{
  "name": "John",
  "email": "john@example.com",
  "isAdmin": true
}
```

Response:

```json
{
  "statusCode": 400,
  "message": [
    "property isAdmin should not exist"
  ],
  "error": "Bad Request"
}
```

Production configuration:

```ts
new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
})
```

---

# 13. `transform`

The `transform` option automatically converts request values into expected DTO types.

Example:

```http
GET /users?page=2
```

Without transformation:

```ts
page === "2"
```

With:

```ts
transform: true
```

and:

```ts
@Type(() => Number)
page: number;
```

The result becomes:

```ts
page === 2
```

---

# 14. Common Validation Decorators

## String Validation

### `@IsString()`

Checks whether a value is a string.

```ts
@IsString()
name: string;
```

---

### `@IsNotEmpty()`

Ensures a value is not empty.

```ts
@IsNotEmpty()
name: string;
```

---

### `@IsOptional()`

Makes a field optional.

```ts
@IsOptional()
@IsString()
bio?: string;
```

If `bio` is missing, validation passes.

If `bio` is provided, it must be a string.

---

### `@MinLength()`

Sets a minimum string length.

```ts
@MinLength(8)
password: string;
```

---

### `@MaxLength()`

Sets a maximum string length.

```ts
@MaxLength(100)
name: string;
```

---

### `@Length()`

Sets both minimum and maximum lengths.

```ts
@Length(3, 50)
username: string;
```

---

### `@Matches()`

Validates a value using a regular expression.

```ts
@Matches(/^[a-zA-Z0-9_]+$/)
username: string;
```

---

# 15. Email Validation

```ts
@IsEmail()
email: string;
```

Valid:

```text
john@example.com
```

Invalid:

```text
john
```

---

# 16. Number Validation

### `@IsNumber()`

```ts
@IsNumber()
price: number;
```

### `@IsInt()`

```ts
@IsInt()
quantity: number;
```

### `@Min()`

```ts
@Min(1)
quantity: number;
```

### `@Max()`

```ts
@Max(100)
quantity: number;
```

Example:

```ts
@Type(() => Number)
@IsInt()
@Min(1)
@Max(100)
quantity: number;
```

---

# 17. Boolean Validation

```ts
@IsBoolean()
isActive: boolean;
```

With transformation:

```ts
@Type(() => Boolean)
@IsBoolean()
isActive: boolean;
```

---

# 18. Date Validation

```ts
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class CreateEventDto {
  @Type(() => Date)
  @IsDate()
  eventDate: Date;
}
```

---

# 19. URL Validation

```ts
@IsUrl()
profilePicture: string;
```

Example:

```json
{
  "profilePicture": "https://example.com/image.jpg"
}
```

---

# 20. UUID Validation

```ts
@IsUUID()
id: string;
```

For a specific version:

```ts
@IsUUID('4')
id: string;
```

---

# 21. Enum Validation

Enum:

```ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
```

DTO:

```ts
@IsEnum(UserRole)
role: UserRole;
```

Valid:

```json
{
  "role": "USER"
}
```

Invalid:

```json
{
  "role": "SUPER_ADMIN"
}
```

---

# 22. Array Validation

```ts
@IsArray()
tags: string[];
```

Validate every array item:

```ts
@IsArray()
@IsString({ each: true })
tags: string[];
```

Request:

```json
{
  "tags": [
    "nestjs",
    "typescript",
    "postgresql"
  ]
}
```

---

# 23. Nested DTO Validation

Child DTO:

```ts
export class AddressDto {
  @IsString()
  city: string;

  @IsString()
  country: string;
}
```

Parent DTO:

```ts
import { Type } from 'class-transformer';
import {
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

Request:

```json
{
  "name": "John",
  "address": {
    "city": "Lucknow",
    "country": "India"
  }
}
```

Important:

```ts
@ValidateNested()
@Type(() => AddressDto)
```

Both decorators are generally needed for nested DTO validation and transformation.

---

# 24. Complete Production-Style Register DTO

```ts
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    {
      message:
        'password must contain uppercase, lowercase, and a number',
    },
  )
  password: string;
}
```

---

# 25. Create DTO vs Update DTO

Create DTO:

```ts
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;
}
```

For updates, fields are usually optional.

Instead of repeating all properties:

```ts
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

NestJS provides `PartialType`.

Install:

```bash
npm install @nestjs/mapped-types
```

Use:

```ts
import {
  PartialType,
} from '@nestjs/mapped-types';

export class UpdateTaskDto extends PartialType(
  CreateTaskDto,
) {}
```

Now all properties from `CreateTaskDto` become optional.

---

# 26. Other Mapped Types

## `PickType`

Select only specific properties.

```ts
export class LoginDto extends PickType(
  CreateUserDto,
  ['email', 'password'] as const,
) {}
```

---

## `OmitType`

Remove selected properties.

```ts
export class CreateAdminDto extends OmitType(
  CreateUserDto,
  ['profilePicture'] as const,
) {}
```

---

## `IntersectionType`

Combine multiple DTOs.

```ts
export class CreateUserWithProfileDto
  extends IntersectionType(
    CreateUserDto,
    ProfileDto,
  ) {}
```

---

# 27. Query DTO Example

```ts
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class TaskQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
```

Controller:

```ts
@Get()
findAll(
  @Query() query: TaskQueryDto,
) {
  return this.tasksService.findAll(
    query,
  );
}
```

Request:

```http
GET /tasks?page=1&limit=10&search=nestjs
```

---

# 28. Validation Error Flow

Request:

```json
{
  "name": "",
  "email": "invalid",
  "password": "123"
}
```

Validation process:

```text
Request
   ↓
ValidationPipe
   ↓
CreateUserDto
   ↓
class-validator
   ↓
Validation fails
   ↓
400 Bad Request
```

Example response:

```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

---

# 29. Custom Validation Messages

```ts
@IsEmail(
  {},
  {
    message:
      'Please provide a valid email address',
  },
)
email: string;
```

Example:

```ts
@MinLength(8, {
  message:
    'Password must contain at least 8 characters',
})
password: string;
```

---

# 30. ValidationPipe Levels

Validation can be applied globally, at the controller level, or at the route level.

## Global

```ts
app.useGlobalPipes(
  new ValidationPipe(),
);
```

Applies to the entire application.

---

## Controller Level

```ts
@UsePipes(
  new ValidationPipe(),
)
@Controller('users')
export class UsersController {}
```

Applies to all routes in the controller.

---

## Route Level

```ts
@Post()
@UsePipes(
  new ValidationPipe(),
)
create(
  @Body() dto: CreateUserDto,
) {
  return dto;
}
```

Applies only to the route.

> **Production Recommendation:** Use a global `ValidationPipe` for consistent validation across the application.

---

# 31. Recommended Production Configuration

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

Explanation:

| Option                           | Purpose                                            |
| -------------------------------- | -------------------------------------------------- |
| `whitelist: true`                | Removes properties not defined in the DTO          |
| `forbidNonWhitelisted: true`     | Throws an error for unknown properties             |
| `transform: true`                | Transforms request data into DTO instances         |
| `enableImplicitConversion: true` | Automatically converts compatible primitive values |

---

# 32. Recommended DTO Folder Structure

```text
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── login.dto.ts
│   │   ├── user-query.dto.ts
│   │   └── user-response.dto.ts
│   │
│   ├── entities/
│   │   └── user.entity.ts
│   │
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
```

---

# 33. DTO Best Practices

1. Create separate DTOs for create and update operations.

2. Do not use `any`.

```ts
// Avoid
create(@Body() body: any)
```

3. Do not use entities directly as request DTOs.

4. Enable global validation.

5. Use:

```ts
whitelist: true
```

6. Consider:

```ts
forbidNonWhitelisted: true
```

7. Use `PartialType()` for update DTOs.

8. Keep business logic out of DTOs.

9. Use DTOs only for data contracts, validation, and transformation.

10. Never expose sensitive fields in response DTOs.

11. Validate all external input:

* Request body
* Query parameters
* Route parameters
* Headers when required

12. Keep DTOs small and feature-specific.

---

# 34. Common Interview Questions

## Q1. What is a DTO?

A DTO, or Data Transfer Object, defines the structure of data transferred between application layers. In NestJS, DTOs are commonly used to validate and type API request data.

---

## Q2. Why do we use DTOs?

DTOs provide:

* Validation
* Type safety
* Clear API contracts
* Better maintainability
* Reusability
* Cleaner controllers

---

## Q3. What is the difference between a DTO and an Entity?

A DTO defines API input or output data, while an entity represents a database model.

---

## Q4. What is `ValidationPipe`?

`ValidationPipe` is a NestJS pipe that validates incoming request data using DTO decorators from `class-validator`. It can also transform request data using `class-transformer`.

---

## Q5. What does `whitelist: true` do?

It removes properties that are not defined and validated in the DTO.

---

## Q6. What does `forbidNonWhitelisted: true` do?

It throws a `400 Bad Request` error when the request contains properties that are not allowed by the DTO.

---

## Q7. What does `transform: true` do?

It transforms plain request objects into DTO class instances and supports type conversion.

---

## Q8. What is the difference between `class-validator` and `class-transformer`?

| `class-validator`     | `class-transformer`                       |
| --------------------- | ----------------------------------------- |
| Validates values      | Transforms values                         |
| Checks rules          | Converts plain objects to class instances |
| Example: `@IsEmail()` | Example: `@Type(() => Number)`            |

---

## Q9. Why is `@Type(() => Number)` used?

HTTP query parameters are received as strings. `@Type(() => Number)` converts values such as `"10"` into `10`.

---

## Q10. Why use `PartialType()`?

`PartialType()` creates an update DTO where all properties from the base DTO become optional.

---

## Q11. What is `@IsOptional()`?

It allows a property to be omitted. If the property is present, its other validation rules are applied.

---

## Q12. Does a TypeScript interface validate request data at runtime?

No.

TypeScript interfaces are removed during compilation and do not exist at runtime. Therefore, they cannot perform runtime validation.

DTO classes work with decorators and runtime validation.

---

# 35. Important Interview Concept

## Interface vs DTO Class

Interface:

```ts
interface CreateUser {
  name: string;
  email: string;
}
```

DTO class:

```ts
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

Difference:

```text
Interface
↓
Compile-time type checking only
↓
Removed after TypeScript compilation

DTO Class
↓
Exists at runtime
↓
Supports decorators
↓
Can be validated by ValidationPipe
```

---

# 36. Final Production Example

## `main.ts`

```ts
async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

## `create-task.dto.ts`

```ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
```

## `update-task.dto.ts`

```ts
import {
  PartialType,
} from '@nestjs/mapped-types';

import {
  CreateTaskDto,
} from './create-task.dto';

export class UpdateTaskDto
  extends PartialType(CreateTaskDto) {}
```

## `tasks.controller.ts`

```ts
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService:
      TasksService,
  ) {}

  @Post()
  create(
    @Body()
    createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(
      createTaskDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(
      id,
      updateTaskDto,
    );
  }
}
```

---

# 37. Quick Revision

```text
DTO
→ Defines API data structure

Request DTO
→ Validates incoming data

Response DTO
→ Controls outgoing data

class-validator
→ Validates DTO properties

class-transformer
→ Transforms request values

ValidationPipe
→ Runs validation and transformation

whitelist
→ Removes unknown properties

forbidNonWhitelisted
→ Rejects unknown properties

transform
→ Converts request data into expected types

PartialType
→ Makes DTO properties optional

DTO ≠ Entity
→ DTO is an API contract
→ Entity is a database model
```

---

# Final Interview Answer

> “In NestJS, DTOs define the structure of data transferred through the API. Request DTOs validate incoming data, while response DTOs control the data returned to clients. NestJS uses `ValidationPipe` with `class-validator` to validate DTO properties and `class-transformer` to transform request values. In production, I generally enable global validation with `whitelist`, `forbidNonWhitelisted`, and `transform` to ensure consistent validation, reject unexpected fields, and improve type safety.”

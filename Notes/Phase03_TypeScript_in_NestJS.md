# Phase 3: TypeScript in NestJS

# 9. Decorators

> **Level:** Beginner → Intermediate
> **Interview Importance:** ⭐⭐⭐⭐⭐
> **Prerequisite:** TypeScript classes, methods, properties, and functions

---

# Table of Contents

1. What Are Decorators?
2. Why Does NestJS Use Decorators?
3. Decorator Types

   * Class Decorators
   * Method Decorators
   * Property Decorators
   * Parameter Decorators
4. Metadata Reflection
5. How NestJS Uses Decorators and Metadata
6. Built-in NestJS Decorators
7. Custom Decorators
8. Decorator Execution and Evaluation
9. Common Mistakes
10. Interview Questions and Answers
11. Quick Revision

---

# 1. What Are Decorators?

A **decorator** is a special TypeScript feature that adds metadata or modifies the behavior of a class, method, property, parameter, or accessor.

Decorators use the `@` symbol.

Example:

```ts
@Controller('users')
export class UsersController {}
```

In this example:

```ts
@Controller('users')
```

is a decorator.

It tells NestJS:

> This class is a controller, and its base route is `/users`.

---

## Simple Definition

> A decorator is a function that is attached to a class member or class declaration using the `@` symbol.

Decorators are commonly used in NestJS for:

* Defining modules
* Creating controllers
* Defining routes
* Registering providers
* Injecting dependencies
* Reading request data
* Adding validation rules
* Applying guards
* Applying interceptors
* Defining custom metadata

---

# 2. Why Does NestJS Use Decorators?

NestJS uses decorators to make application code:

* Declarative
* Readable
* Organized
* Easy to understand
* Less repetitive

Without decorators, a framework might require manual configuration.

Example:

```ts
registerController(
  UsersController,
  '/users',
);
```

With NestJS decorators:

```ts
@Controller('users')
export class UsersController {}
```

The decorator expresses the intent directly.

---

# 3. Types of Decorators

TypeScript decorators can be applied to:

```text
1. Class
2. Method
3. Property
4. Parameter
5. Accessor
```

For NestJS architecture, the most commonly used types are:

```text
Class Decorators
Method Decorators
Property Decorators
Parameter Decorators
```

---

# 4. Class Decorators

A **Class Decorator** is applied to a class declaration.

Syntax:

```ts
@DecoratorName()
class MyClass {}
```

NestJS examples:

```ts
@Module({})
export class AppModule {}
```

```ts
@Controller('users')
export class UsersController {}
```

```ts
@Injectable()
export class UsersService {}
```

---

## Common Class Decorators

| Decorator       | Purpose                     |
| --------------- | --------------------------- |
| `@Module()`     | Defines a NestJS module     |
| `@Controller()` | Defines a controller        |
| `@Injectable()` | Marks a class as injectable |
| `@Catch()`      | Defines an exception filter |

---

## Example: `@Controller()`

```ts
import {
  Controller,
  Get,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return ['User 1', 'User 2'];
  }
}
```

Request:

```http
GET /users
```

Response:

```json
[
  "User 1",
  "User 2"
]
```

`@Controller('users')` stores route-related metadata for the class.

---

## Example: `@Injectable()`

```ts
import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

`@Injectable()` allows NestJS to manage the class through its Dependency Injection system.

---

## How a Class Decorator Works

A class decorator receives the class constructor.

Example:

```ts
function LogClass(
  target: Function,
) {
  console.log(
    target.name,
  );
}

@LogClass
class UsersService {}
```

Output:

```text
UsersService
```

The `target` is the class constructor.

---

# 5. Method Decorators

A **Method Decorator** is applied to a method.

Syntax:

```ts
class MyClass {
  @DecoratorName()
  myMethod() {}
}
```

NestJS examples:

```ts
@Get()
findAll() {}
```

```ts
@Post()
create() {}
```

```ts
@UseGuards(AuthGuard)
@Get('profile')
getProfile() {}
```

---

## Common Method Decorators

| Decorator            | Purpose                      |
| -------------------- | ---------------------------- |
| `@Get()`             | Handles GET requests         |
| `@Post()`            | Handles POST requests        |
| `@Put()`             | Handles PUT requests         |
| `@Patch()`           | Handles PATCH requests       |
| `@Delete()`          | Handles DELETE requests      |
| `@UseGuards()`       | Applies guards               |
| `@UseInterceptors()` | Applies interceptors         |
| `@UsePipes()`        | Applies pipes                |
| `@HttpCode()`        | Changes the HTTP status code |
| `@Header()`          | Adds a response header       |

---

## Example: Route Method Decorators

```ts
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'Get all users';
  }

  @Get(':id')
  findOne() {
    return 'Get one user';
  }

  @Post()
  create() {
    return 'Create user';
  }

  @Patch(':id')
  update() {
    return 'Update user';
  }

  @Delete(':id')
  remove() {
    return 'Delete user';
  }
}
```

Routes:

```text
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
DELETE /users/:id
```

---

## How a Method Decorator Works

A method decorator receives:

```ts
target
propertyKey
descriptor
```

Example:

```ts
function LogMethod(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  console.log(
    propertyKey,
  );
}

class UsersService {
  @LogMethod
  findAll() {
    return [];
  }
}
```

Output:

```text
findAll
```

### Parameters

| Parameter     | Meaning                                |
| ------------- | -------------------------------------- |
| `target`      | Class prototype for an instance method |
| `propertyKey` | Name of the decorated method           |
| `descriptor`  | Property descriptor of the method      |

---

# 6. Property Decorators

A **Property Decorator** is applied to a class property.

Syntax:

```ts
class MyClass {
  @DecoratorName()
  property: string;
}
```

NestJS example:

```ts
@Injectable()
export class UsersService {
  @Inject('DATABASE_URL')
  private readonly databaseUrl: string;
}
```

`@Inject()` tells NestJS which dependency should be injected.

---

## Example: Custom Property Decorator

```ts
function LogProperty(
  target: object,
  propertyKey: string,
) {
  console.log(
    `Property: ${propertyKey}`,
  );
}

class User {
  @LogProperty
  name: string;
}
```

Output:

```text
Property: name
```

---

## Property Decorator Parameters

A property decorator receives:

```ts
target
propertyKey
```

| Parameter     | Meaning                        |
| ------------- | ------------------------------ |
| `target`      | Class prototype                |
| `propertyKey` | Name of the decorated property |

---

## Important Note

A property decorator does not directly receive a property descriptor.

This is different from a method decorator.

---

# 7. Parameter Decorators

A **Parameter Decorator** is applied to a method parameter.

NestJS uses parameter decorators heavily to extract request data.

Example:

```ts
@Get(':id')
findOne(
  @Param('id') id: string,
) {
  return id;
}
```

`@Param('id')` extracts the `id` value from the URL.

Request:

```http
GET /users/10
```

Value:

```text
id = "10"
```

---

## Common NestJS Parameter Decorators

| Decorator          | Reads                   |
| ------------------ | ----------------------- |
| `@Body()`          | Request body            |
| `@Param()`         | Route parameters        |
| `@Query()`         | Query parameters        |
| `@Headers()`       | Request headers         |
| `@Req()`           | Raw request object      |
| `@Res()`           | Raw response object     |
| `@UploadedFile()`  | Uploaded file           |
| `@UploadedFiles()` | Multiple uploaded files |

---

## Example: `@Body()`

```ts
@Post()
create(
  @Body() createUserDto:
    CreateUserDto,
) {
  return createUserDto;
}
```

Request:

```json
{
  "name": "John",
  "email": "john@example.com"
}
```

---

## Example: `@Param()`

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
GET /users/25
```

Response:

```json
{
  "id": "25"
}
```

---

## Example: `@Query()`

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

---

## Example: `@Headers()`

```ts
@Get('profile')
getProfile(
  @Headers('authorization')
  authorization: string,
) {
  return {
    authorization,
  };
}
```

---

## How a Parameter Decorator Works

A parameter decorator receives:

```ts
target
propertyKey
parameterIndex
```

Example:

```ts
function LogParameter(
  target: object,
  propertyKey: string,
  parameterIndex: number,
) {
  console.log({
    propertyKey,
    parameterIndex,
  });
}

class UsersController {
  findOne(
    @LogParameter id: string,
  ) {}
}
```

Output:

```text
{
  propertyKey: "findOne",
  parameterIndex: 0
}
```

---

# 8. Decorator Target Summary

| Decorator Type | Applied To       | Main Parameters                           |
| -------------- | ---------------- | ----------------------------------------- |
| Class          | Class            | `target`                                  |
| Method         | Method           | `target`, `propertyKey`, `descriptor`     |
| Property       | Property         | `target`, `propertyKey`                   |
| Parameter      | Method parameter | `target`, `propertyKey`, `parameterIndex` |

---

# 9. Metadata Reflection

## What Is Metadata?

**Metadata** means:

> Data about other data.

In NestJS, metadata stores information about classes and class members.

Example:

```ts
@Controller('users')
export class UsersController {}
```

The decorator stores information similar to:

```text
Class:
UsersController

Controller path:
users
```

NestJS later reads this metadata to configure routes.

---

## What Is Reflection?

**Reflection** is the ability of a program to inspect information about classes, methods, properties, and parameters at runtime.

NestJS uses reflection to discover:

* Controllers
* Routes
* Providers
* Constructor dependencies
* Guards
* Roles
* Custom metadata

---

## Metadata Flow in NestJS

```text
Decorator
    │
    ▼
Stores Metadata
    │
    ▼
Reflect Metadata API
    │
    ▼
NestJS Reads Metadata
    │
    ▼
NestJS Configures Application
```

Example:

```ts
@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return id;
  }
}
```

NestJS can determine:

```text
Controller:
UsersController

Base path:
/users

HTTP method:
GET

Route:
/:id

Parameter:
id
```

---

# 10. `reflect-metadata`

NestJS uses the `reflect-metadata` library to store and read metadata.

The package enables metadata APIs such as:

```ts
Reflect.defineMetadata()
```

```ts
Reflect.getMetadata()
```

---

## Define Metadata

```ts
import 'reflect-metadata';

class User {}

Reflect.defineMetadata(
  'role',
  'admin',
  User,
);
```

---

## Read Metadata

```ts
const role =
  Reflect.getMetadata(
    'role',
    User,
  );

console.log(role);
```

Output:

```text
admin
```

---

# 11. TypeScript Compiler Configuration

Decorator support is configured in `tsconfig.json`.

Example:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## `experimentalDecorators`

Enables decorator syntax.

```json
{
  "experimentalDecorators": true
}
```

Without this option, TypeScript may reject decorator syntax depending on the project configuration and decorator model being used.

---

## `emitDecoratorMetadata`

Emits design-time type metadata.

```json
{
  "emitDecoratorMetadata": true
}
```

This helps frameworks such as NestJS inspect constructor parameter types.

Example:

```ts
@Injectable()
export class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}
}
```

TypeScript can emit metadata similar to:

```ts
Reflect.metadata(
  'design:paramtypes',
  [UsersService],
);
```

NestJS can use this information to resolve the dependency.

---

# 12. How NestJS Uses Metadata for Dependency Injection

Example:

```ts
@Injectable()
export class UsersService {}
```

```ts
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService:
      UsersService,
  ) {}
}
```

Conceptual flow:

```text
UsersController
       │
       ▼
Constructor parameter:
UsersService
       │
       ▼
Type metadata is available
       │
       ▼
NestJS DI Container
       │
       ▼
Find UsersService provider
       │
       ▼
Create or reuse instance
       │
       ▼
Inject UsersService
```

---

# 13. Metadata Keys

NestJS stores different information using metadata keys.

Conceptual examples:

```text
PATH_METADATA
METHOD_METADATA
GUARDS_METADATA
INTERCEPTORS_METADATA
PIPES_METADATA
```

Example:

```ts
@Controller('users')
```

Stores route path metadata.

```ts
@Get(':id')
```

Stores HTTP method and route metadata.

```ts
@UseGuards(AuthGuard)
```

Stores guard-related metadata.

---

# 14. Custom Decorators

NestJS allows developers to create custom decorators.

Custom decorators reduce repeated code and improve readability.

---

## Example: Custom `@Roles()` Decorator

```ts
import {
  SetMetadata,
} from '@nestjs/common';

export const Roles = (
  ...roles: string[]
) =>
  SetMetadata(
    'roles',
    roles,
  );
```

Use it:

```ts
@Roles('admin')
@Get()
findAllUsers() {
  return [];
}
```

The decorator stores:

```text
Metadata key:
roles

Metadata value:
['admin']
```

A guard can read this metadata and authorize the request.

---

## Reading Custom Metadata

```ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import {
  Reflector,
} from '@nestjs/core';

@Injectable()
export class RolesGuard
  implements CanActivate
{
  constructor(
    private readonly reflector:
      Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles =
      this.reflector.get<string[]>(
        'roles',
        context.getHandler(),
      );

    return true;
  }
}
```

---

## Recommended Version Using `getAllAndOverride()`

```ts
const roles =
  this.reflector.getAllAndOverride<
    string[]
  >(
    'roles',
    [
      context.getHandler(),
      context.getClass(),
    ],
  );
```

This allows metadata to be read from:

1. The route handler
2. The controller class

---

# 15. Custom Parameter Decorator

NestJS provides `createParamDecorator()`.

Example:

```ts
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const CurrentUser =
  createParamDecorator(
    (
      data: unknown,
      context:
        ExecutionContext,
    ) => {
      const request =
        context
          .switchToHttp()
          .getRequest();

      return request.user;
    },
  );
```

Use it:

```ts
@Get('profile')
getProfile(
  @CurrentUser() user: User,
) {
  return user;
}
```

This avoids repeating:

```ts
@Req() request: Request
```

and:

```ts
request.user
```

in every controller method.

---

# 16. Decorator Execution

Decorators are evaluated when the class is defined, not every time a request reaches the route.

Example:

```ts
function Log() {
  console.log(
    'Decorator evaluated',
  );
}

class UsersService {
  @Log()
  findAll() {}
}
```

The decorator runs during class definition/loading.

The method itself runs when called.

---

# 17. Decorator Evaluation Order

When multiple decorators are used, decorator expressions are evaluated in a defined order.

Example:

```ts
@First()
@Second()
class Example {}
```

Conceptually:

```text
Expression evaluation:
First()
Second()

Decorator application:
Second
First
```

A useful memory rule:

> Decorator expressions are evaluated from top to bottom, but applied from bottom to top.

---

# 18. Common Mistakes

## Mistake 1: Putting Business Logic Inside Decorators

Bad:

```ts
@CheckDatabaseAndCreateUser()
createUser() {}
```

Decorators should mainly define metadata or reusable framework behavior.

Business logic should usually remain in services.

---

## Mistake 2: Overusing Custom Decorators

Creating decorators for very small or one-time logic can make code harder to understand.

Use custom decorators when they:

* Reduce repeated code
* Improve readability
* Represent a meaningful concept

---

## Mistake 3: Confusing Decorators with Middleware

Decorators:

* Add metadata
* Configure framework behavior
* Declare routes and dependencies

Middleware:

* Executes during the request pipeline
* Can modify requests and responses
* Runs before the controller

---

## Mistake 4: Assuming Decorators Execute on Every Request

Most decorator setup happens when the application loads and classes are evaluated.

The framework later reads the stored metadata while building or handling application behavior.

---

## Mistake 5: Using `@Res()` Unnecessarily

Using the raw response object can bypass some of NestJS's standard response handling.

Prefer returning values directly unless low-level response control is required.

---

# 19. Decorators vs Middleware

| Decorators                         | Middleware                                     |
| ---------------------------------- | ---------------------------------------------- |
| Add metadata or configure behavior | Execute in the request pipeline                |
| Declarative                        | Procedural                                     |
| Used with `@` syntax               | Registered in application/module configuration |
| Define routes, guards, roles, etc. | Modify requests and responses                  |

---

# 20. Decorators vs Guards

| Decorators                 | Guards                             |
| -------------------------- | ---------------------------------- |
| Define or store metadata   | Make authorization decisions       |
| Example: `@Roles('admin')` | Example: `RolesGuard`              |
| Usually declarative        | Executes during request processing |

Example:

```ts
@Roles('admin')
@Get()
findAll() {}
```

The decorator stores the required role.

The guard reads the role metadata and decides whether the request is allowed.

---

# 21. Complete NestJS Example

## `users.controller.ts`

```ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(
    @Query('page')
    page: string,
  ) {
    return {
      page,
    };
  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return {
      id,
    };
  }

  @Post()
  create(
    @Body()
    createUserDto:
      CreateUserDto,
  ) {
    return createUserDto;
  }
}
```

---

## Decorator Breakdown

```ts
@Controller('users')
```

Type:

```text
Class Decorator
```

Purpose:

```text
Defines the controller
and base route.
```

---

```ts
@Get(':id')
```

Type:

```text
Method Decorator
```

Purpose:

```text
Defines a GET route.
```

---

```ts
@Param('id')
```

Type:

```text
Parameter Decorator
```

Purpose:

```text
Extracts the `id`
from the route.
```

---

```ts
@Body()
```

Type:

```text
Parameter Decorator
```

Purpose:

```text
Extracts request body data.
```

---

# 22. Interview Questions and Answers

## 1. What is a decorator in TypeScript?

A decorator is a function or language feature applied using the `@` syntax that can add metadata or modify/configure behavior for a class, method, property, parameter, or accessor.

---

## 2. Why does NestJS use decorators?

NestJS uses decorators to declaratively define modules, controllers, routes, providers, request parameters, guards, interceptors, pipes, and custom metadata.

---

## 3. What are the main decorator types?

The main decorator types are:

1. Class decorators
2. Method decorators
3. Property decorators
4. Parameter decorators
5. Accessor decorators

---

## 4. What is a class decorator?

A class decorator is applied to a class.

Examples:

```ts
@Module({})
```

```ts
@Controller('users')
```

```ts
@Injectable()
```

---

## 5. What is a method decorator?

A method decorator is applied to a method.

Examples:

```ts
@Get()
```

```ts
@Post()
```

```ts
@UseGuards(AuthGuard)
```

---

## 6. What is a parameter decorator?

A parameter decorator is applied to a method parameter.

Examples:

```ts
@Body()
```

```ts
@Param()
```

```ts
@Query()
```

---

## 7. What is metadata?

Metadata is data that describes other data.

In NestJS, metadata can describe routes, HTTP methods, dependencies, guards, roles, and other framework configuration.

---

## 8. What is reflection?

Reflection is the ability to inspect classes, methods, properties, and metadata at runtime.

NestJS uses reflection to discover application structure and resolve dependencies.

---

## 9. What is `reflect-metadata`?

`reflect-metadata` provides APIs for defining and reading metadata.

Examples:

```ts
Reflect.defineMetadata()
```

```ts
Reflect.getMetadata()
```

---

## 10. What is `emitDecoratorMetadata`?

`emitDecoratorMetadata` tells TypeScript to emit design-time type metadata that frameworks such as NestJS can use for dependency injection and reflection.

---

## 11. What is the purpose of `@Injectable()`?

`@Injectable()` marks a class as a provider that can participate in NestJS dependency injection.

---

## 12. What is `SetMetadata()` used for?

`SetMetadata()` attaches custom metadata to a class or method.

It is commonly used for:

* Roles
* Permissions
* Feature flags
* Custom authorization rules

---

## 13. How does `@Roles()` work?

`@Roles()` stores allowed roles as metadata.

A guard reads that metadata and decides whether the current user is authorized.

---

## 14. What is the difference between a decorator and a guard?

A decorator usually defines or stores metadata.

A guard executes during request processing and uses metadata or request information to allow or deny access.

---

## 15. Do decorators execute on every request?

Decorator setup generally occurs when classes are evaluated during application initialization. NestJS later uses the metadata they define to configure and process application behavior.

---

# 23. Quick Revision

```text
Decorators
│
├── Use the @ syntax
├── Add metadata or configure behavior
│
├── Class Decorators
│   ├── @Module()
│   ├── @Controller()
│   └── @Injectable()
│
├── Method Decorators
│   ├── @Get()
│   ├── @Post()
│   └── @UseGuards()
│
├── Property Decorators
│   └── @Inject()
│
├── Parameter Decorators
│   ├── @Body()
│   ├── @Param()
│   ├── @Query()
│   └── @Headers()
│
└── Metadata Reflection
    ├── Stores application information
    ├── Uses reflect-metadata
    ├── Reads types and custom metadata
    └── Supports routing and DI
```

---

# Final Interview Summary

> NestJS uses TypeScript decorators to declaratively define application structure and behavior. Class decorators define modules, controllers, and injectable providers. Method decorators define routes and apply features such as guards or interceptors. Parameter decorators extract request data. NestJS uses metadata reflection to inspect these declarations and resolve routes, dependencies, and framework behavior at runtime.

> **Interview Tip:**
> Remember this flow:

```text
Decorator
    ↓
Metadata is stored
    ↓
Reflection reads metadata
    ↓
NestJS understands application structure
    ↓
Routes and dependencies are configured
```

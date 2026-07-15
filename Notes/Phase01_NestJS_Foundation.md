# Phase 1 NestJS Foundation

# 1. Introduction

## What is NestJS?

NestJS is a progressive Node.js framework for building scalable,
maintainable, and enterprise-grade server-side applications. It is built
on top of Express by default (or Fastify) and uses TypeScript
extensively.

### Key Features

-   TypeScript-first
-   Modular architecture
-   Dependency Injection (DI)
-   MVC architecture
-   Built-in testing support
-   Validation, Guards, Pipes, Filters, Interceptors
-   REST, GraphQL, WebSockets, Microservices support

### Interview Answer (1--2 minutes)

> NestJS is a backend framework built on top of Express or Fastify. It
> follows a modular architecture and heavily uses Dependency Injection,
> making applications easier to maintain, test, and scale. It is
> inspired by Angular's architecture and is widely used for enterprise
> Node.js applications.

------------------------------------------------------------------------

## Why NestJS?

### Problems in Express

-   No standard architecture
-   Manual dependency management
-   Difficult to scale large applications
-   Folder structure differs by project

### NestJS Benefits

-   Opinionated structure
-   Built-in Dependency Injection
-   Easy testing
-   Better maintainability
-   Excellent TypeScript support
-   Enterprise ready

------------------------------------------------------------------------

## NestJS vs Express

  | Feature | Express | NestJS |
  |---------|---------|---------|
  | Architecture | Unopinionated | Opinionated |
  | TypeScript | Optional | First-class |
  | Dependency Injection | No | Yes |
  | Scalability | Manual | Excellent |
  | Testing | Manual | Built-in support |
  | Suitable for | Small APIs | Medium/Large applications |

> **Interview Tip:** NestJS uses **Express** as its default HTTP platform, but it can also use **Fastify** by replacing the underlying adapter. This means if you already know Express, transitioning to NestJS is straightforward, while Fastify can be chosen for better performance and lower overhead.

------------------------------------------------------------------------

## Architecture

Typical flow:

Client ↓ Middleware ↓ Guards ↓ Interceptors (Before) ↓ Pipes ↓
Controller ↓ Service ↓ Repository / Database ↓ Interceptors (After) ↓
Response

Remember this request lifecycle---it is frequently asked.

------------------------------------------------------------------------

## MVC Pattern

-   **Model** → Database/entities
-   **View** → JSON response (REST APIs)
-   **Controller** → Handles HTTP requests
-   **Service** → Business logic

NestJS separates business logic into Services instead of Controllers.

------------------------------------------------------------------------

## Project Structure

Main files:

-   `main.ts` → Application entry point
-   `app.module.ts` → Root module
-   Controllers → Receive requests
-   Services → Business logic
-   Modules → Group related features

------------------------------------------------------------------------

## Nest CLI

Install

``` bash
npm i -g @nestjs/cli
```

Create project

``` bash
nest new my-app
```

Generate controller

``` bash
nest g controller users
```

Generate service

``` bash
nest g service users
```

Generate module

``` bash
nest g module users
```

Generate resource

``` bash
nest g resource users
```

------------------------------------------------------------------------

# 2. Creating a Project

## Installation

Requirements - Node.js LTS - npm - Nest CLI

Create project

``` bash
nest new project-name
```

Run

``` bash
npm run start:dev
```

Build

``` bash
npm run build
```

Production

``` bash
npm run start:prod
```

------------------------------------------------------------------------

## Modules

A Module organizes related functionality.

Example:

``` ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

>**Interview:** Every NestJS application has at least one root module
(`AppModule`).

------------------------------------------------------------------------

## Controllers

Controllers receive incoming HTTP requests.

``` ts
@Controller('users')
export class UsersController {

  @Get()
  findAll() {
    return [];
  }
}
```

------------------------------------------------------------------------

## Services

Services contain business logic.

``` ts
@Injectable()
export class UsersService {
  findAll() {
    return [];
  }
}
```

Controllers should remain thin; business logic belongs in services.

------------------------------------------------------------------------

## Build & Watch Mode

Development

``` bash
npm run start:dev
```

Watch mode recompiles automatically.

Production

``` bash
npm run build
npm run start:prod
```

------------------------------------------------------------------------

# 3. Folder Structure

``` text
src/
├── main.ts
├── app.module.ts
├── modules/
├── controllers/
├── services/
├── dto/
├── entities/
├── guards/
├── pipes/
├── filters/
├── interceptors/
├── middlewares/
├── decorators/
├── common/
├── config/
├── database/
└── utils/
```

## Folder Purpose

-   **modules/** Feature grouping
-   **controllers/** HTTP request handlers
-   **services/** Business logic
-   **dto/** Request/response validation objects
-   **entities/** Database models/entities
-   **guards/** Authentication & authorization
-   **pipes/** Validation & transformation
-   **filters/** Exception handling
-   **interceptors/** Logging, response mapping
-   **middlewares/** Runs before request handling
-   **decorators/** Custom decorators
-   **common/** Shared utilities/components
-   **config/** Environment configuration
-   **database/** DB connection, migrations
-   **utils/** Helper functions

------------------------------------------------------------------------

# Frequently Asked Interview Questions

1.  What is NestJS?
2.  Why use NestJS over Express?
3.  Is NestJS built on Express?
4.  Can NestJS use Fastify?
5.  What is a Module?
6.  Difference between Controller and Service?
7.  What is Dependency Injection?
8.  What is AppModule?
9.  What is main.ts?
10. Explain the NestJS request lifecycle.
11. Why are Controllers kept thin?
12. What does `@Injectable()` do?
13. What does `@Controller()` do?
14. What is the Nest CLI?
15. How do you create a new module?

------------------------------------------------------------------------

# Common Mistakes

-   Putting business logic inside controllers.
-   Creating one huge AppModule.
-   Skipping DTOs.
-   Ignoring TypeScript types.
-   Not using feature modules.
-   Hardcoding configuration.

------------------------------------------------------------------------

# Revision Checklist

-   Explain NestJS in under 2 minutes.
-   Draw the request lifecycle.
-   Explain MVC.
-   Compare Express vs NestJS.
-   Create a project from CLI.
-   Generate modules/controllers/services.
-   Explain every folder in `src/`.
-   Explain AppModule and main.ts.

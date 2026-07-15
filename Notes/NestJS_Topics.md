# NestJS Roadmap

## Phase 1 -- NestJS Foundation

### 1. Introduction

-   What is NestJS?
-   Why NestJS?
-   Nest vs Express
-   Architecture
-   MVC Pattern
-   Project Structure
-   Nest CLI

### 2. Creating a Project

-   Installation
-   CLI Commands
-   Modules
-   Controllers
-   Services
-   Build & Watch Mode

### 3. Folder Structure

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

## Phase 2 -- Core Architecture

### 4. Modules

-   Root Module
-   Feature Module
-   Shared Module
-   Global Module
-   Dynamic Module
-   Imports & Exports

### 5. Controllers

-   GET, POST, PUT, PATCH, DELETE
-   Params, Query, Body, Headers
-   Decorators (@Controller, @Get, @Post, @Body, @Param, @Query, etc.)

### 6. Providers

-   Injectable
-   Singleton
-   Request Scope
-   Transient Scope

### 7. Services

-   Business Logic
-   Service Communication
-   Repository Injection

### 8. Dependency Injection

-   DI Container
-   Constructor Injection
-   Injection Tokens
-   Custom, Factory, Existing & Value Providers

## Phase 3 -- TypeScript in NestJS

### 9. Decorators

-   Class
-   Method
-   Property
-   Parameter
-   Metadata Reflection

## Phase 4 -- Request Lifecycle

Middleware → Guards → Interceptors (Before) → Pipes → Controller →
Service → Database → Interceptors (After) → Response → Exception Filter

## Phase 5 -- DTO & Validation

### 10. DTO

-   Request DTO
-   Response DTO

### 11. Validation

-   class-validator
-   class-transformer
-   ValidationPipe
-   Whitelist
-   Transform
-   Common decorators

## Phase 6 -- Database (Prisma or TypeORM)

### 12. ORM

-   Configuration
-   Models
-   CRUD
-   Relations
-   Transactions
-   Migrations
-   Seeding
-   Indexes
-   Soft Delete

## Phase 7 -- Authentication & Authorization

### 13. Authentication

-   JWT
-   Passport
-   Local & JWT Strategy
-   Access/Refresh Tokens
-   bcrypt

### 14. Authorization

-   RBAC
-   Permissions
-   Policies

## Phase 8 -- Guards

-   AuthGuard
-   RolesGuard
-   Custom Guards
-   Reflector

## Phase 9 -- Pipes

-   ValidationPipe
-   ParseIntPipe
-   ParseUUIDPipe
-   ParseBoolPipe
-   Custom Pipes

## Phase 10 -- Middleware

-   Functional
-   Class-based
-   Global
-   Consumer API

## Phase 11 -- Exception Filters

-   HttpException
-   Built-in Exceptions
-   Custom Exceptions
-   Global Filters

## Phase 12 -- Interceptors

-   Logging
-   Response Mapping
-   Timeout
-   Cache
-   Custom Interceptors

## Phase 13 -- Custom Decorators

-   @CurrentUser()
-   @Roles()
-   @Public()
-   @Permissions()

## Phase 14 -- Configuration

-   ConfigModule
-   Environment Variables
-   Config Validation

## Phase 15 -- File Upload

-   Multer
-   Images
-   PDFs
-   Cloudinary
-   AWS S3 (Basics)

## Phase 16 -- Swagger

-   Setup
-   DTO Documentation
-   Authentication
-   Responses

## Phase 17 -- Redis

-   CacheModule
-   Redis
-   TTL
-   Cache Interceptor

## Phase 18 -- Scheduling

-   Cron Jobs
-   Timeout
-   Interval

## Phase 19 -- Events

-   Event Emitter
-   Event Listeners

## Phase 20 -- Email

-   Nodemailer
-   OTP
-   Password Reset
-   Verification

## Phase 21 -- Logging

-   Nest Logger
-   Winston
-   Morgan

## Phase 22 -- Security

-   Helmet
-   CORS
-   Rate Limiting
-   SQL Injection Prevention
-   XSS
-   CSRF Basics

## Phase 23 -- Testing

-   Jest
-   Unit Testing
-   E2E Testing
-   Mocking

## Phase 24 -- Performance

-   Pagination
-   Filtering
-   Sorting
-   Compression
-   Caching
-   Indexes

## Phase 25 -- Advanced NestJS

-   Lifecycle Hooks
-   Dynamic Modules
-   ModuleRef
-   Reflector
-   ExecutionContext
-   forwardRef
-   Circular Dependency

## Phase 26 -- WebSockets

-   Gateway
-   Rooms
-   Events
-   Authentication

## Phase 27 -- Microservices

-   TCP
-   RabbitMQ
-   Redis
-   Kafka (Basics)
-   gRPC (Basics)

## Phase 28 -- Deployment

-   Docker
-   Docker Compose
-   PM2
-   Nginx
-   Linux
-   CI/CD Basics

## Phase 29 -- Architecture

-   SOLID Principles
-   Repository Pattern
-   Service Layer Pattern
-   Clean Architecture
-   Modular Design

## Phase 30 -- Projects

1.  Authentication API
2.  Employee Management System
3.  Expense Tracker
4.  Blog API
5.  E-commerce Backend
6.  Hospital Management System
7.  Job Portal API
8.  Food Delivery Backend
9.  Inventory Management System
10. Chat Backend (WebSockets)

# Interview Checklist

-   NestJS Architecture
-   Modules
-   Controllers
-   Services
-   Dependency Injection
-   Decorators & Metadata
-   DTOs & Validation
-   Middleware
-   Guards
-   Pipes
-   Interceptors
-   Exception Filters
-   JWT & Passport
-   Prisma/TypeORM
-   CRUD & Relations
-   Pagination, Filtering & Sorting
-   File Uploads
-   Swagger
-   Redis
-   Cron Jobs
-   Docker
-   Testing
-   Production Deployment

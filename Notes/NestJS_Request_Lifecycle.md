# NestJS Request Lifecycle (Architecture)

> **Interview Importance:** ⭐⭐⭐⭐⭐  
> **Difficulty:** Beginner → Intermediate  
> **Frequently Asked In:** NestJS, Node.js, Backend Developer Interviews

---

# What is Request Lifecycle?

The **Request Lifecycle** is the sequence of steps that an incoming HTTP request follows inside a NestJS application before a response is sent back to the client.

Understanding this lifecycle helps you know **where to place authentication, validation, business logic, database operations, logging, and error handling.**

---

# Complete Request Lifecycle

```text
                    Incoming HTTP Request
                             │
                             ▼
                      Global Middleware
                             │
                             ▼
                      Route Middleware
                             │
                             ▼
                          Guards
            (Authentication / Authorization)
                             │
                             ▼
                    Interceptors (Before)
                             │
                             ▼
                          Pipes
                (Validation & Transformation)
                             │
                             ▼
                         Controller
                             │
                             ▼
                          Service
                             │
                             ▼
                   Repository / Database
                             │
                             ▼
                          Service
                             │
                             ▼
                         Controller
                             │
                             ▼
                    Interceptors (After)
                             │
                             ▼
             Exception Filters (Only on Error)
                             │
                             ▼
                       HTTP Response
```
---

# Step 1 — Client

The client sends an HTTP request.

Example

```http
POST /users
```

Example Request

```json
{
    "name":"John",
    "email":"john@gmail.com",
    "password":"123456"
}
```

Nothing happens inside NestJS until the request reaches the application.

---

# Step 2 — Middleware

Middleware is the **first component** that handles an incoming request.

### Purpose

- Logging
- Authentication token extraction
- CORS
- Helmet
- Rate Limiting
- Request modification

### Example

```ts
app.use(LoggerMiddleware);
```

```ts
req.user = decodedUser;
next();
```

### Important Points

✔ Executes before Guards

✔ Can modify Request and Response

✔ Must call

```ts
next();
```

otherwise request stops.

### Real Example

```text
                    Incoming Request
                           ↓
                    Logger Middleware
                           ↓
                         Print
                      POST /users
                           ↓
                         Next()
```

---

# Step 3 — Guards

Guards decide

> **Can this request continue?**

They are mainly used for

- Authentication
- Authorization
- Roles
- Permissions

Example

```ts
@UseGuards(AuthGuard)
```

Guard returns

```ts
true
```

or

```ts
false
```

If it returns false

```text
Request Ends

401 Unauthorized
```

### Interview Tip

Guards answer only one question:

> **Should this request execute?**

---

# Step 4 — Interceptors (Before)

Interceptors run **before the controller method executes.**

They can

- Log request
- Cache response
- Measure execution time
- Modify request
- Wrap response

Example

```ts
console.time("API");
```

---

# Step 5 — Pipes

Pipes are responsible for

- Validation
- Transformation
- Sanitization

Example DTO

```ts
class CreateUserDto {

    @IsEmail()

    email: string;

}
```

Incoming Data

```json
{
    "age":"22"
}
```

After Pipe

```ts
age: number
```

Common Pipes

- ValidationPipe
- ParseIntPipe
- ParseUUIDPipe
- ParseBoolPipe
- ParseArrayPipe

### Interview Tip

Pipes execute **before Controller**.

---

# Step 6 — Controller

The controller receives validated data and handles routing.

Example

```ts
@Post()
create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
}
```

Controller Responsibilities

- Receive Request
- Call Service
- Return Response

Controllers should contain **minimal business logic**.

---

# Step 7 — Service

Service contains

## Business Logic

Example

```ts
create(dto) {

    return this.userRepository.save(dto);

}
```

Responsibilities

- Business Rules
- Calculations
- API Calls
- Email Sending
- Payment Processing
- Repository Calls

Services should never handle HTTP routing.

---

# Step 8 — Repository / Database

Repository interacts directly with the database.

Example

```ts
return this.userRepository.find();
```

Can use

- TypeORM
- Prisma
- Sequelize
- Mongoose
- Raw SQL

Repository Responsibility

Only Database Operations.

---

# Step 9 — Return Back

After database returns data

```text
            Repository
                ↓
             Service
                ↓
            Controller
```

The controller sends the response back.

---

# Step 10 — Interceptors (After)

Executed after the controller returns data.

Uses

- Response Formatting
- Logging
- Caching
- Execution Time
- Hide Sensitive Data

Example

Before

```json
{
    "id":1,
    "name":"John",
    "password":"123456"
}
```

After

```json
{
    "id":1,
    "name":"John"
}
```

---

# Step 11 — Exception Filters

If any error occurs

```ts
throw new NotFoundException();
```

Exception Filter catches it.

Returns

```json
{
    "statusCode":404,
    "message":"User Not Found"
}
```

Exception Filters prevent application crashes and provide consistent error responses.

---

# Step 12 — Response

Finally

```text
HTTP Response

↓

Client
```

Example

```json
{
    "success": true,
    "message": "User Created Successfully",
    "data": {
        "id": 1,
        "name": "John"
    }
}
```

---

# Complete Lifecycle (One-Line Flow)

```text
                 Client
                    │
                    ▼
               Middleware
                    │
                    ▼
                 Guards
                    │
                    ▼
          Interceptors (Before)
                    │
                    ▼
                  Pipes
                    │
                    ▼
                Controller
                    │
                    ▼
                 Service
                    │
                    ▼
           Repository / Database
                    │
                    ▼
                 Service
                    │
                    ▼
                Controller
                    │
                    ▼
           Interceptors (After)
                    │
                    ▼
            Exception Filters
                    │
                    ▼
                 Response
```

---

# Real Example (User Registration API)

```text
                 Client
                    ↓
               POST /users
                    ↓
             Logger Middleware
                    ↓
                JWT Guard
                    ↓
            Logging Interceptor
                    ↓
              Validation Pipe
                    ↓
              User Controller
                    ↓
               User Service
                    ↓
              User Repository
                    ↓
               PostgreSQL
                    ↓
              User Repository
                    ↓
               User Service
                    ↓
             User Controller
                    ↓
            Response Interceptor
                    ↓
                Response

            {
                "success": true,
                "data": {
                    "id": 1,
                    "name": "John"
                }
            }
```

---

# Responsibilities Table

| Component | Responsibility |
|-----------|----------------|
| Middleware | Logging, CORS, request preprocessing |
| Guards | Authentication & Authorization |
| Interceptors | Logging, caching, response formatting |
| Pipes | Validation & Transformation |
| Controller | Handle routes and delegate work |
| Service | Business Logic |
| Repository | Database Operations |
| Exception Filter | Handle Errors |
| Response | Return data to client |

---

# Common Interview Questions

## Q1. Explain the NestJS Request Lifecycle.

**Answer**

```
                       Client
                          ↓
                     Middleware
                          ↓
                        Guards
                          ↓
                Interceptors (Before)
                          ↓
                        Pipes
                          ↓
                     Controller
                          ↓
                       Service
                          ↓
                 Repository / Database
                          ↓
                       Service
                          ↓
                      Controller
                          ↓
                  Interceptors (After)
                          ↓
                    Exception Filters
                          ↓
                      Response
```

---

## Q2. Which component executes first?

**Answer**

Middleware

---

## Q3. Which component validates incoming data?

**Answer**

Pipes

---

## Q4. Which component handles authentication?

**Answer**

Guards

---

## Q5. Where should business logic be written?

**Answer**

Service

---

## Q6. Which layer communicates with the database?

**Answer**

Repository

---

## Q7. Which component can modify both request and response?

**Answer**

Interceptors

---

## Q8. Which component catches exceptions globally?

**Answer**

Exception Filters

---

## Q9. Can Middleware stop a request?

**Answer**

Yes.

If Middleware does not call

```ts
next();
```

the request never reaches the controller.

---

## Q10. What is the difference between Middleware and Guards?

| Middleware | Guards |
|------------|--------|
| Executes first | Executes after Middleware |
| Used for logging, CORS, parsing | Used for authentication and authorization |
| Does not decide access by default | Decides whether the request is allowed |

---

# Memory Trick

```
M → Middleware

G → Guards

I → Interceptors (Before)

P → Pipes

C → Controller

S → Service

R → Repository

S → Service

C → Controller

I → Interceptors (After)

E → Exception Filters

R → Response
```

### Mnemonic

> **My Great Interview Preparation Creates Strong Repositories, Smart Controllers, Incredible Error Responses.**

---

# Best Practices

- Keep **Middleware** for logging and request preprocessing.
- Use **Guards** only for authentication and authorization.
- Validate all incoming data with **Pipes**.
- Keep **Controllers thin**—only handle routing.
- Place all business logic inside **Services**.
- Restrict **Repositories** to database operations.
- Use **Interceptors** for logging, caching, and response formatting.
- Centralize error handling with **Exception Filters**.
- Follow the **Single Responsibility Principle (SRP)** for every layer.

---

# Interview Summary (30-Second Answer)

> **In NestJS, every request follows a defined lifecycle. The request first passes through Middleware for preprocessing, then Guards for authentication and authorization, followed by Interceptors (before execution), Pipes for validation and transformation, the Controller for routing, the Service for business logic, and the Repository for database access. The response then travels back through the Service and Controller, Interceptors can modify the outgoing response, Exception Filters handle any errors, and finally the HTTP response is returned to the client.**
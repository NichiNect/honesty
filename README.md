# Honesty Framework

Honesty is a lightweight and modular framework for building RESTful APIs using the [Hono](https://hono.dev) framework, running on the [Bun](https://bun.sh) runtime. This framework promotes a clean and organized structure, and employes a minimal screaming architecture, integrating with [Zod](https://zod.dev) for schema validation and [Drizzle ORM](https://orm.drizzle.team) for database interactions. Honesty was inspired by popular backend frameworks, to make your development process seamless and efficient.

## Features

- **Hono Framework**: Provides a lightweight and high-performance foundation for building web applications.
- **Modular Screaming Architecture**: Organize your codebase by modules to ensure scalability and maintainability.
- **Decorator-Based Routing**: Define routes directly in your controllers using decorators.
- **Middleware Integration**: Easily apply middleware globally or per route.
- **TypeScript Support**: Write clean and type-safe code with full TypeScript support.
- **Bun Runtime**: Ensures fast server-side JavaScript execution.
- **Zod Validator**: Facilitates runtime schema validation for TypeScript.
- **Drizzle ORM**: Offers a type-safe and efficient Object-Relational Mapping for database operations.

---

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (ensure it's installed and set as your runtime environment)

### Steps

1. **Clone the repository & navigate to the project directory**:
   ```bash
   git clone https://github.com/NichiNect/honesty.git
   cd honesty
   ```

2. **Install dependencies using Bun**:
   ```bash
   bun install
   ```

### Configuration

1. **Environment Variables**:

   Create a `.env` file in the root directory and define the necessary environment variables. Refer to `.env.example` for guidance.

2. **Database Setup**:

   Ensure your database is configured correctly. Update the database connection settings in the configuration files as needed.

### Running the Application

To start the development server:

```bash
bun dev
```

---

## Project Structure

The project follows a modular architecture. Each module contains all related files, including controllers, services, and models. Below is the general structure:

```
src/
├── core/
├── database/
│   ├── migrations/
|   ├── connections.ts
|   └── schema.ts
├── middlewares/
├── user/
│   ├── user.controller.ts
│   ├── user.dto.ts
│   ├── user.entity.ts
│   ├── user.service.ts
│   └── index.ts
└── index.ts
```

---

## Route Decorators

Honesty Framework provides a clean and efficient way to define HTTP routes directly within your controllers using route decorators. These decorators map specific HTTP methods to controller methods, allowing for a more organized and declarative approach to routing.

### Available Decorators

- **`@Get(path: string)`**  
  Maps a controller method to handle HTTP GET requests for the specified path.

- **`@Post(path: string)`**  
  Maps a controller method to handle HTTP POST requests for the specified path.

- **`@Put(path: string)`**  
  Maps a controller method to handle HTTP PUT requests for the specified path.

- **`@Delete(path: string)`**  
  Maps a controller method to handle HTTP DELETE requests for the specified path.

### Example Route Decorators

```typescript
import { Context } from 'hono';

export class UserController {
    @Get('user/:id')
    public async index(ctx: Context) {
        return ctx.json({ id: ctx.req.param('id'), name: 'Hello World!' })
    }
}
```

---

## Middlewares

In the Honesty Framework, middleware can be applied in three different ways. This flexibility allows you to choose the most suitable method for your use case. Middleware is executed in the following order:

1. **Global Middleware**: Applied to all routes in the application.
2. **Controller-Level Middleware**: Injected when registering a controller.
3. **Route-Specific Middleware**: Applied using the `@Middleware` decorator on individual controller methods.

### 1. Global Middleware

Global middleware is defined in the `src/middleware/index.ts` file and applies to all routes in the application. Use this for middleware that should be executed universally, such as logging or response formatting.

```typescript
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

export const globalMiddlewares = [
    logger(),
    prettyJSON(),
];
```

### 2. Controller-Level Middleware

Controller-level middleware is injected when registering a controller using the `applyRoutes()` function in `src/index.ts`. This middleware is executed after global middleware and before route-specific middleware.

```typescript
import { Hono } from 'hono';
import { applyRoutes } from './core/decorators/route_decorator';
import { requestId } from 'hono/request-id';
import { UserController } from './user';

const app = new Hono();

/**
 * Applying route module.
 */
applyRoutes(app, UserController, [requestId()]);
```

### 3. Route-Specific Middleware

Route-specific middleware is applied directly to individual controller methods using the @Middleware decorator. This allows for fine-grained control over which middleware is executed for specific routes.

#### Register Middleware Aliases

Before using middleware aliases with the `@Middleware()` decorator, ensure that the middleware is registered in the `src/middleware/index.ts` file. Use the `middlewareAliases` object to map alias names to their respective middleware functions.

Example Register Middleware Alias:

```typescript
import { authMiddleware } from './auth.middleware';
import { roleMiddleware } from './role.middleware';

export const middlewareAliases: IMiddlewareRegister = {
    auth: authMiddleware,
    role: roleMiddleware,
};
```

Example Usage:

```typescript
import { Context } from 'hono';
import { Get } from '../core/decorators/route_decorator';
import { Middleware } from '../core/decorators/middleware_decorator';

export class UserController {
    @Get('user/:id')
    @Middleware(['auth'])
    public async index(ctx: Context) {
        return ctx.json({ id: ctx.req.param('id'), name: 'Hello World!' })
    }
}
```

---

## Usage Example

Below is an example usage of the **User Module** to demonstrate how to create and fetch user data.

### User Module

The User module manages user-related operations. Below are examples demonstrating its usage:

- **Creating a new user & retrieving a user by ID**:

   ```typescript
    import type { Context } from 'hono';
    import { Get, Post } from '../core/decorators/route_decorator';
    import { UserService } from './user.service';

    export class UserController {
        constructor(private readonly userService: UserService = new UserService()) {}

        @Post('/user')
        public async store(ctx: Context) {
            const body = await ctx.req.json();

            const user = await this.userService.createUser(body);

            return ctx.json({
                messge: 'Success',
                data: user
            });
        }

        @Get('/user/:id')
        public async show(ctx: Context) {
            const id = ctx.req.param('id');

            const user = await this.userService.getUserById(id);

            return ctx.json({
                message: 'Success',
                data: user
            });
        }
    }
   ```

### User Service

Handle business logic in the `user.service.ts` file:

```typescript
import { db } from '../database/connection';
import { UserEntity } from './user.entity';

export class UserService {
    private userRepository = db.query.UserEntity;
    private users: UserModel[] = [];

    public async getUser() {
        return db.select().from(UserEntity);
    }

    public async getUserById(id: number) {
        return this.userRepository.findFirst({
            where: eq(UserEntity.id, id)
        });
    }
}
```

### User Entity

Define the data structure for a user in the `user.entity.ts` file:

```typescript
import { mysqlEnum, mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";

export const UserEntity = mysqlTable('users', {
    id: serial().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    role: mysqlEnum(['admin', 'staff']),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});
```

Because the Drizzle ORM by default requires 1 file to export the database table schema, so don't forget to register it to file `src/database/schema.ts` like this:

```typescript
export * from '../user/user.entity'
```


### Register the Module

Ensure the module is registered in the `src/index.ts` file:

```typescript
import { applyRoutes } from './core/decorators/route_decorator';
import { UserController } from './user';

/**
 * Applying route module.
 */
applyRoutes(app, UserController, [middlewareIfAny()]);

```

---

## How to Contribute

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes.
4. Commit your changes: `git commit -m 'Add: develop feature x'`.
5. Push to the branch: `git push origin feature-name`.
6. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

For more information, visit the [Hono](https://hono.dev/) documentation, [DrizzleORM](https://orm.drizzle.team) documentation, or [Bun](https://bun.sh) documentations
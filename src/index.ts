import 'reflect-metadata';
import { Hono } from 'hono';
import { applyRoutes } from './core/decorators/route_decorator';

import { UserController } from './user';
import { globalMiddlewares } from './middleware';
import { requestId } from 'hono/request-id';

const app = new Hono();

/**
 * Registering global middleware.
 */
app.use('*', ...globalMiddlewares);

/**
 * Applying route module.
 */
applyRoutes(app, UserController, [requestId()]);

console.log(`Server running on port ${Bun.env.APP_PORT}`);
export default {
    port: Bun.env.APP_PORT,
    fetch: app.fetch
};

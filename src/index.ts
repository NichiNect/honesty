import 'reflect-metadata';
import { Hono } from 'hono';
import { applyRoutes } from './core/decorators/route_decorator';

import { UserController } from './user';
import { globalMiddlewares } from './middleware';
import { requestId } from 'hono/request-id';
import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';

const app = new Hono();

/**
 * Registering global middleware.
 */
app.use('*', ...globalMiddlewares);

/**
 * Applying route module.
 */
applyRoutes(app, UserController, [requestId()]);


/**
 * Handle HttpException to JSON
 */
app.onError((err: Error | HTTPException, ctx: Context) => {

    console.error('Error:', err);
    if (err instanceof HTTPException) {

        return ctx.json({
            status: 'Error',
            message: err.message,
            errors: err.cause || {}
        }, err.status)
    }

    return ctx.json({
        status: 'Error',
        message: 'Internal Server Error'
    }, 500);
});

console.log(`Server running on port ${Bun.env.APP_PORT}`);
export default {
    port: Bun.env.APP_PORT,
    fetch: app.fetch
};

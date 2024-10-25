import type { Context, Next } from 'hono';
import { createMiddleware } from 'hono/factory';

export const authMiddleware = () => {

    return createMiddleware( async (ctx: Context, next: Next) => {

        console.log('middleware auth ran');
        const token = ctx.req.header('Authorization');

        if (!token) {
            return ctx.json({
                message: 'Unauthenticated'
            }, 401);
        }

        return next();
    });
}

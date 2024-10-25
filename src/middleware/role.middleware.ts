import type { Context, Next } from 'hono';
import { createMiddleware } from 'hono/factory';

export const roleMiddleware = (role: string) => {

    return createMiddleware( async (ctx: Context, next: Next) => {

        console.log('middleware role ran');
        const staticRole = 'admin';

        if (staticRole !== role) {
            return ctx.json({
                message: 'Your account isn\'t an admin'
            }, 403);
        }

        return next();
    });
}

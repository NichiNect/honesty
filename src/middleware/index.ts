import type { IMiddlewareRegister } from '../core/types/middleware_types';
import { authMiddleware } from './auth.middleware';
import { roleMiddleware } from './role.middleware';
import { logger } from 'hono/logger';

/**
 * Global middleware that implements to all route.
 * This may be execute first than you inject in applyRoutes() function 
 * or using the @Middleware() decorator.
 */
export const globalMiddlewares = [
    logger(),
];

/**
 * Aliases to be used instead of class names to conveniently assign middleware to routes.
 */
export const middlewareAliases: IMiddlewareRegister = {
    auth: authMiddleware,
    role: roleMiddleware,
};

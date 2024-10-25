import type { IMiddlewareRegister } from '../core/types/middleware_types';
import { authMiddleware } from './auth.middleware';
import { roleMiddleware } from './role.middleware';

/**
 * Aliases to be used instead of class names to conveniently assign middleware to routes.
 */
export const middlewareAliases: IMiddlewareRegister = {
    auth: authMiddleware,
    role: roleMiddleware,
};

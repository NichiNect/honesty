import type { IMiddlewareRegister } from '../core/types/middleware_types';
import { authMiddleware } from './auth.middleware';
import { roleMiddleware } from './role.middleware';

export const middlewares: IMiddlewareRegister = {
    auth: authMiddleware,
    role: roleMiddleware,
};

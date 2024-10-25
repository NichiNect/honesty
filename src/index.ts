import 'reflect-metadata';
import { Hono } from 'hono';
import { applyRoutes } from './core/decorators/route_decorator';

import { UserController } from './user';

const app = new Hono();

applyRoutes(app, UserController);

console.log(`Server running on port ${Bun.env.APP_PORT}`);
export default {
    port: Bun.env.APP_PORT,
    fetch: app.fetch
};

import type { Context } from 'hono';
import { Get, Post } from '../core/decorators/route_decorator';
import { UserService } from './user.service';
import { Middleware } from '../core/decorators/middleware_decorator';

export class UserController {

    private userService = new UserService();

    @Get('/user/:id')
    @Middleware(['auth', 'role:admin'])
    public async getUser(ctx: Context) {
        const user = await this.userService.getUserById(ctx.req.param('id'));
        return ctx.json(user);
    }

    @Post('/user')
    @Middleware(['auth', 'role:admin'])
    public async store(ctx: Context) {

        const body = await ctx.req.parseBody();

        return ctx.json({
            requestId: ctx.get('requestId'),
            ...body
        });
    }
}

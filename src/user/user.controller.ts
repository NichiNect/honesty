import { Get } from '../core/route_decorator';
import type { Context } from 'hono';
import { UserService } from './user.service';

export class UserController {

    private userService = new UserService();

    @Get('/user/:id')
    public async getUser(ctx: Context) {
        const user = await this.userService.getUserById(ctx.req.param('id'));
        return ctx.json(user);
    }
}

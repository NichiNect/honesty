import type { Context } from 'hono';
import { Get, Post } from '../core/decorators/route_decorator';
import { UserService } from './user.service';
import { Middleware } from '../core/decorators/middleware_decorator';
import { CreateUserSchema } from './user.dto';

export class UserController {

    constructor(private readonly userService: UserService = new UserService()) {}

    @Get('/user')
    @Middleware(['auth', 'role:admin'])
    public async index(ctx: Context) {

        const user = await this.userService.getUser();

        return ctx.json({
            message: 'Success',
            data: user
        });
    }

    @Get('/user/:id')
    @Middleware(['auth', 'role:admin'])
    public async show(ctx: Context) {

        const id = parseInt(ctx.req.param('id'));

        const user = await this.userService.getUserById(id);

        return ctx.json({
            message: 'Success',
            data: user
        });
    }

    @Post('/user')
    @Middleware(['auth', 'role:admin'])
    public async store(ctx: Context) {

        const body = await ctx.req.json();

        // ? Validate Requests
        const validatedParams = CreateUserSchema.safeParse(body);
        if (!validatedParams.success) {
            return ctx.json(validatedParams, 422);
        }

        // ? Handle User Creation
        const user = await this.userService.createUser(validatedParams.data);

        // ? Response
        return ctx.json({
            requestId: ctx.get('requestId'),
            message: 'Success',
            data: user
        });
    }
}

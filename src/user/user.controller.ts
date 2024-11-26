import type { Context } from 'hono';
import { Delete, Get, Post, Put } from '../core/decorators/route_decorator';
import { UserService } from './user.service';
import { Middleware } from '../core/decorators/middleware_decorator';
import { CreateUserSchema, UpdateUserSchema } from './user.dto';

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

        if (!user) {
            return ctx.json({
                message: 'User not found'
            }, 404);
        }

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

    @Put('/user/:id')
    @Middleware(['auth', 'role:admin'])
    public async update(ctx: Context) {

        const id = parseInt(ctx.req.param('id'));
        const body = await ctx.req.json();

        // ? Validate Requests
        const validatedParams = await UpdateUserSchema.safeParseAsync({ id, ...body});
        if (!validatedParams.success) {
            return ctx.json(validatedParams, 422);
        }

        // ? Handle User Update
        const user = await this.userService.updateUser(id, validatedParams.data);

        // ? Response
        return ctx.json({
            requestId: ctx.get('requestId'),
            message: 'Success',
            data: user
        });
    }

    @Delete('/user/:id')
    @Middleware(['auth', 'role:admin'])
    public async delete(ctx: Context) {

        const id = parseInt(ctx.req.param('id'));

        // ? Find User
        const user = await this.userService.getUserById(id);

        if (!user) {
            return ctx.json({
                message: 'User not found'
            }, 404);
        }

        // ? Handle User Delete
        await this.userService.deleteUser(id);

        // ? Response
        return ctx.json({
            requestId: ctx.get('requestId'),
            message: 'Success',
            data: user
        });
    }
}

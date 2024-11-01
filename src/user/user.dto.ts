import { z } from 'zod';
import { UserRoleEnum } from './user.entity';

export const CreateUserSchema = z.object({
    name: z.string().max(255),
    email: z.string().max(255).email(),
    role: z.nativeEnum(UserRoleEnum)
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

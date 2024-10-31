import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().max(255),
    email: z.string().max(255).email(),
    role: z.string().max(64)
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>

export const UpdateUserSchema = CreateUserSchema.partial()

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>

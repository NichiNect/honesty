import { z } from 'zod';
import { UserEntity, UserRoleEnum } from './user.entity';
import { db } from '../database/connection';
import { eq, sql } from 'drizzle-orm';

export const CreateUserSchema = z.object({
    name: z.string().max(255),
    email: z.string().max(255).email()
        .superRefine(async (val, ctx) => {
            const exists = await db.select({
                    id: UserEntity.id
                })
                .from(UserEntity)
                .where(eq(UserEntity.email, val))
                .limit(1);

            if (exists) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `Not dupplicates allowed.`
                })
            }
            
            console.log(exists);
        }),
    role: z.nativeEnum(UserRoleEnum)
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
    id: z.number().optional(),
    name: z.string().max(255),
    email: z.string().max(255).email(),
    role: z.nativeEnum(UserRoleEnum)
})
.partial()
.superRefine(async (val, ctx) => {

    const exists = await db.select({
            id: UserEntity.id
        })
        .from(UserEntity)
        // .where(and(
        //     eq(UserEntity.email, val.email), ne(UserEntity.id, val.id || 0)
        // ))
        .where(sql`${UserEntity.email} = ${val.email} AND ${UserEntity.id} != ${val.id}`)
        .limit(1);

    if (exists.length > 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Not dupplicates allowed.`
        })
    }
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

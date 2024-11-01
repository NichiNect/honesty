import { HTTPException } from 'hono/http-exception'
import { CreateUserDto } from './user.dto';
import { db } from '../database/connection';
import { UserEntity } from './user.entity';
import { eq } from 'drizzle-orm';

export class UserService {
    private userRepository = db.query.UserEntity;

    public async getUser() {
        return db.select().from(UserEntity);
    }

    public async getUserById(id: number) {
        return this.userRepository.findFirst({
            where: eq(UserEntity.id, id)
        });
    }

    public async createUser(createUserDto: CreateUserDto) {
        if (createUserDto.role == 'admin') {
            throw new HTTPException(400, {
                message: "You dont allowed for create admin user!",
                cause: {}
            });
        }

        const user = await db.insert(UserEntity).values(createUserDto).$returningId();

        return this.getUserById(user[0]?.id);
    }
}

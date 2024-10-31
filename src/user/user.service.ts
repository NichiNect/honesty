import { HTTPException } from 'hono/http-exception'
import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';

export class UserService {
    private userRepository = new UserRepository();

    async getUserById(id: string) {
        return this.userRepository.findById(id);
    }

    async createUser(createUserDto: CreateUserDto) {
        if (createUserDto.role == 'admin') {
            throw new HTTPException(400, {
                message: "You dont allowed for create admin user!",
                cause: {}
            });
        }
        return this.userRepository.create(createUserDto);
    }
}

import { UserRepository } from './user.repository';
import { CreateUserDto } from './user.dto';

export class UserService {
    private userRepository = new UserRepository();

    async getUserById(id: string) {
        return this.userRepository.findById(id);
    }

    async createUser(createUserDto: CreateUserDto) {
        return this.userRepository.create(createUserDto);
    }
}

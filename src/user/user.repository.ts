import { CreateUserDto } from './user.dto';

// TODO: for now this repository layer just for simulate.
export class UserRepository {

    async findById(id: string) {
        return { id, name: 'John Doe', email: 'john@example.com' };
    }

    async create(createUserDto: CreateUserDto) {
        return { id: 1, ...createUserDto };
    }
}

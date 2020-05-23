import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';
import { User } from "./user.entity";
import { AuthCredentiallsDto } from './dto/auth-credentials.dto'


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentiallsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSaltSync();

        const user = this.create();
        user.username = username;
        user.password = await this.hashPassword(password, salt);

        try {
            await user.save();
        } catch (error) {
            if (error.code == '23505') { // duplicated username
                throw new ConflictException('Username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentiallsDto) : Promise<string> {
        const { username , password } = authCredentialsDto;

        const user = await this.findOne({ username });

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string) : Promise<string> {
        return bcrypt.hashSync(password, salt);
    }

}
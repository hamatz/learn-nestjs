import { Test } from "@nestjs/testing";
import { UserRepository } from "./user.repository";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword'};

describe('UserRepository', () => {
    let userRepository;

    beforeEach( async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository,
            ],
        }).compile();
        userRepository = await module.get<UserRepository>(UserRepository);
    });
    
    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        })
        it('successfully sign up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
        });

        it('throws a conflict eception as username already exists ', () => {
            save.mockRejectedValue({ code: '23505'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('throws a conflict eception as username already exists ', () => {
            save.mockRejectedValue({ code: '123123'});
            expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        });
    });
    describe('validateUserPassword', () => {
        let user;

        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = 'TestUsername';
            user.password = 'hogegefuga'
            user.validatePassword = jest.fn();
        });
        it('return the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const resut = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(resut).toEqual('TestUsername');
        });
        it('return null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toEqual(null);
        });

        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(null);
            const result = await user.validatePassword(user.password);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toEqual(null);
        });
    });

    describe('validateUserPassword', () => {
        it('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hashSync = jest.fn().mockResolvedValue('hashed Password');
            expect(bcrypt.hashSync).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('TestPassword','testSalt');
            expect(bcrypt.hashSync).toHaveBeenCalled();
            expect(result).toEqual('hashed Password');
        });
    });
});
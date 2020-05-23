import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User entity', () => {
    describe('ValidatePassword', () => {

        let user: User;

        beforeEach(() => {
            user = new User();
            user.password = 'TestPassword';
            bcrypt.compareSync = jest.fn();
        });

        it('successfully password is valid', async () => {
            bcrypt.compareSync.mockResolvedValue(true);
            expect(bcrypt.compareSync).not.toHaveBeenCalled();
            const result = await user.validatePassword(user.password);
            expect(bcrypt.compareSync).toHaveBeenCalled();
            expect(result).toEqual(true);
        });

        it('return false because password was invalid', async () => {
            bcrypt.compareSync.mockResolvedValue(false);
            expect(bcrypt.compareSync).not.toHaveBeenCalled();
            const result = await user.validatePassword(user.password);
            expect(bcrypt.compareSync).toHaveBeenCalled();
            expect(result).toEqual(false);
        });

    });
});
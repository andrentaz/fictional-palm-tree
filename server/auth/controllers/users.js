import PasswordValidator from 'password-validator';

import UserRepository from '../repositories/users';

class UserController {

    async getUser(email) {
        const user = await UserRepository.findByEmail(email);
        if (user) {
            return user;
        } else {
            throw new Error('User not found!');
        }
    }

    async createUser(data) {
        const { email, password } = data;

        if (!this._validatePasswordFormat(password)) {
            throw new Error('Password must have 8-100 characters, digits, symbols and no spaces');
        }

        const user = await UserRepository.findByEmail(email);
        if (user) {
            throw new Error('Email already in use!');
        }

        await UserRepository.createUser(data);
    }

    _validatePasswordFormat(password) {
        const schema = new PasswordValidator();

        schema
            .is().min(8)
            .is().max(100)
            .has().digits()
            .has().not().spaces();

        return schema.validate(password);
    }
}

export default new UserController();

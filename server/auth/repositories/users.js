import PasswordHash from 'password-hash';

import Users from '../models/users';

class UserRepository {

    async findByEmail(email) {
        return await Users.findOne({ email }).exec();
    }

    async createUser(userData) {
        const newUser = new Users(userData);
        newUser.passwordHash = PasswordHash.generate(userData.password);

        try {
            await newUser.save();
        } catch (error) {
            throw error;
        }
    }
}

export default new UserRepository();

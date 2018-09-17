import PasswordHash from 'password-hash';

import Users from '../models/users';

class UserRepository {

    async validateByEmail(email, password) {
        const user = await Users.findOne({ email }).exec();
        if (user) {
            return user.validatePassword(password);
        }
        return false;
    }

    async findByEmail(email) {
        return await Users.findOne({ email }).exec();
    }

    async createUser(userData) {
        const newUser = new Users(userData);
        newUser.createdAt = new Date();
        newUser.updatedAt = new Date();
        newUser.passwordHash = PasswordHash.generate(userData.password);

        try {
            await newUser.save();
        } catch (error) {
            throw error;
        }
    }
}

export default new UserRepository();

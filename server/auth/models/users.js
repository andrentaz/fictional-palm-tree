import Mongoose from 'mongoose';
import PasswordHash from 'password-hash';


const UserSchema = new Mongoose.Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    cellphone: {
        type: String,
        trim: true,
    },
    birthday: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

UserSchema.methods.validatePassword = function(password) {
    return PasswordHash.verify(password, this.passwordHash);
}

export default Mongoose.model('User', UserSchema);

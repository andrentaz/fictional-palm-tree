import Mongoose from 'mongoose';
import MongooseTimestamp from 'mongoose-timestamp';
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
    gender: {
        type: String,
        trim: true
    },
    maritalStatus: {
        type: String,
        trim: true
    },
    documentNumber: {
        type: String,
        trim: true,
        required: true,
    }
});

UserSchema.methods.validatePassword = function(password) {
    return PasswordHash.verify(password, this.passwordHash);
}

UserSchema.methods.getMetadata = function() {
    return {
        fullName: this.fullName,
        email: this.email,
    }
}

UserSchema.plugin(MongooseTimestamp)

export default Mongoose.model('User', UserSchema);

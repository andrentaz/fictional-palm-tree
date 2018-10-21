import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 8083,
    mongo_uri: process.env.MONGO_URI,
    secret: process.env.SECRET,
}
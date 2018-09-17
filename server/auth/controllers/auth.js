import JWT from 'jsonwebtoken';

const TTL_IN_SECONDS = 24 * 60 * 60;
class AuthController {
    getToken(payload, secret) {
        return JWT.sign(payload, secret, {
            expiresIn: TTL_IN_SECONDS
        });
    }
}

export default new AuthController();

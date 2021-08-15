import { joi, is, XMongoDataType } from 'xpress-mongo';
import { DBCollection } from '@xpresser/xpress-mongo';
const bcrypt = require('bcrypt');

// Model Interface (optional)
export interface UserDataType {
    _id: Object;
    updatedAt?: Date;
    createdAt: Date;
    password: string;
}

/**
 * @class User
 * @extends XMongoModel
 */
class User extends DBCollection('users') {
    static async LOGIN_CHECK(email: any, password: any) {
        const user = await this.native().findOne({ email });

        if (user) {
            const auth = await bcrypt.compare(password, user.password);

            if (auth) {
                return user;
            }
            throw Error('incorrect password');
        }
        throw Error('This user does not exist');
    }

    static strict = { removeNonSchemaFields: true };

    // Set Model Schema
    static schema = {
        updatedAt: is.Date(),
        createdAt: is.Date().required(),
        email: joi.string().email().required(),
        password: joi.string(),
    };

    // Set Model data type (optional)
    public data!: UserDataType;
}

User.on('create', async (user) => {
    const salt = await bcrypt.genSalt();
    user.data.password = await bcrypt.hash(user.data.password, salt);
});

export default User;

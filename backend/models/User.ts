import {is, XMongoSchema, XMongoModel} from 'xpress-mongo';
import {UseCollection} from '@xpresser/xpress-mongo';

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface UserDataType {
    updatedAt?: Date,
    createdAt: Date,
}

/**
 * User Model
 * Collection: `users`
 */
class User extends XMongoModel {

    // Set Model Schema
    static schema: XMongoSchema = {
        updatedAt: is.Date(),
        createdAt: is.Date().required()
    };

    public data!: UserDataType;
}

/**
* Map Model to Collection: `users`
* .native() will be made available for use.
*/
UseCollection(User, "users");

export default User;

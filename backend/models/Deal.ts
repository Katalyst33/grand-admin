import {is, XMongoSchema, XMongoModel} from 'xpress-mongo';
import {UseCollection} from '@xpresser/xpress-mongo';

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface DealDataType {
    updatedAt?: Date,
    createdAt: Date,
}

/**
 * Deal Model
 * Collection: `deals`
 */
class Deal extends XMongoModel {

    // Set Model Schema
    static schema: XMongoSchema = {
        updatedAt: is.Date(),
        createdAt: is.Date().required(),
        title:is.String().required(),
    };

    public data!: DealDataType;
}

/**
* Map Model to Collection: `deals`
* .native() will be made available for use.
*/
UseCollection(Deal, "deals");

export default Deal;

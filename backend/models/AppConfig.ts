import {is, XMongoSchema, XMongoModel} from 'xpress-mongo';
import {UseCollection} from '@xpresser/xpress-mongo';

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface AppConfigDataType {
    updatedAt?: Date,
    createdAt: Date,
}

/**
 * AppConfig Model
 * Collection: `app_configs`
 */
class AppConfig extends XMongoModel {

    // Set Model Schema
    static schema: XMongoSchema = {
        updatedAt: is.Date(),
        createdAt: is.Date().required(),
        companyName:is.String().required(),
        contact: is.Object(() => ({
            phone: null,
            email: null,
            address: null,
            twitter:null,
            instagram:null,
            facebook:null
        })),


    };

    public data!: AppConfigDataType;
}

/**
* Map Model to Collection: `app_configs`
* .native() will be made available for use.
*/
UseCollection(AppConfig, "app_configs");

export default AppConfig;

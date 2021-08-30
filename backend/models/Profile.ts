import { is, XMongoSchema, XMongoModel } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import { isString } from "util";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface ProfileDataType {
  updatedAt?: Date;
  createdAt: Date;
}

/**
 * Profile Model
 * Collection: `profiles`
 */
class Profile extends XMongoModel {
  // Set Model Schema
  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    uuid: is.Uuid(4).required(),
    firstName: is.String(),
    lastname: is.String(),
    phone: is.String(),
    address: is.String(),
  };

  public data!: ProfileDataType;
}

/**
 * Map Model to Collection: `profiles`
 * .native() will be made available for use.
 */
UseCollection(Profile, "profiles");

export default Profile;
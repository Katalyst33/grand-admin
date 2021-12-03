import { is, XMongoSchema, XMongoModel } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import { isString } from "util";
import { $, randomStr } from "../exports";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface ProfileDataType {
  updatedAt?: Date;
  createdAt: Date;
  images: Object;
  ownerId: string;
  comment: string;
  reference: string;
  contactInformation: Object;
  personalInformation: Object;
  otherInformation: Object;
  EducationInfo: Object;
}

/**
 * Profile Model
 * Collection: `profiles`
 */
class Profile extends XMongoModel {
  // Set Model Schema
  // static strict = true;
  static strict = { removeNonSchemaFields: true };

  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    uuid: is.Uuid(4).required(),
    ownerId: is.String().required(),
    reference: is.String(() => randomStr()).required(),
    personalInformation: is.Object(),
    contactInformation: is.Object(),
    otherInformation: is.Object(),
    EducationInfo: is.Object(),
    images: is.Object(),
    comment: is.String(),
  };

  public data!: ProfileDataType;
}

/**
 * Map Model to Collection: `profiles`
 * .native() will be made available for use.
 */
UseCollection(Profile, "profiles");

//index field for searching
// Profile.native().createIndex({ reference: 1 }, { unique: true }).catch();

export default Profile;

import { is, XMongoSchema } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import { randomStr } from "../exports";
import MainModel from "./MainModel";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface ProfileDataType {
  updatedAt?: Date;
  createdAt: Date;
  images: Object;
  ownerId: string;
  reference: string;
  contactInformation: Object;
  personalInformation: {
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    birthName: string;
    birth_day: string;
    nationality: string;
    place_of_birth: string;
  };
  otherInformation: Object;
  educationInformation: Object;
  comment: string;
}

/**
 * Profile Model
 * Collection: `profiles`
 */
class Profile extends MainModel {
  // Set Model Schema
  // static strict = true;
  static strict = { removeNonSchemaFields: true };

  static publicFields = [
    "updatedAt",
    "createdAt",
    "contactInformation",
    "personalInformation",
    "otherInformation",
    "educationInformation",
    "comment",
    "reference",
    "ownerId",
  ];

  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    uuid: is.Uuid(4).required(),
    ownerId: is.String().required(),
    reference: is.String(() => randomStr()).required(),
    personalInformation: is.Object(),
    contactInformation: is.Object(),
    otherInformation: is.Object(),
    educationInformation: is.Object(),
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

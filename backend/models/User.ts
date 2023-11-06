import { joi, is, XMongoSchema } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

import MainModel from "./MainModel";
const bcrypt = require("bcrypt");

const userRoles = ["user", "staff", "admin", "taliban"];

// Model Interface (optional)
export interface UserDataType {
  _id: Object;
  uuid: string;
  updatedAt?: Date;
  lastSeenAt?: Date;
  createdAt: Date;
  role?: string;
  username: string;
  reference: string;
  email: string;
  password: string;
  passwordReset?: {
    code: string;
    sentAt: Date;
  };
}

/**
 * @class User
 * @extends XMongoModel
 */
class User extends MainModel {
  static async LOGIN_CHECK(email: any, password: any) {
    const user = await this.native().findOne({ email });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        return user;
      }
      throw Error("incorrect password");
    }
    throw Error("This user does not exist");
  }

  static strict = { removeNonSchemaFields: true };
  static publicFields = [
    "email",
    "uuid",
    "role",
    "username",
    "passwordReset",
    "reference",
    "createdAt",
    "updatedAt",
    "lastSeenAt",
  ];
  // Set Model Schema
  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    lastSeenAt: is.Date(),
    uuid: is.Uuid(4).required(),
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string(),
    role: is.InArray(userRoles, "user"),
    passwordReset: joi
      .object({
        code: joi.string().required(),
        sentAt: joi.date().required(),
      })
      .label("Password Reset"),
  };

  // Set Model data type (optional)
  public data!: UserDataType;
}

User.on("create", async (user) => {
  const salt = await bcrypt.genSalt();
  console.log(user);
  user.data.password = await bcrypt.hash(user.data.password, salt);
});
UseCollection(User, "users");

export default User;

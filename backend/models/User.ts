import { joi, is, XMongoDataType, omitIdAndPick } from "xpress-mongo";
import { DBCollection } from "@xpresser/xpress-mongo";
import { $ } from "../exports";
const bcrypt = require("bcrypt");

const userRoles = ["user", "staff", "admin", "taliban"];

// Model Interface (optional)
export interface UserDataType {
  _id: Object;
  uuid: string;
  updatedAt?: Date;
  createdAt: Date;
  role: string;
  reference: string;
  email: string;
  password: string;
}

/**
 * @class User
 * @extends XMongoModel
 */
class User extends DBCollection("users") {
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

  // Set Model Schema
  static schema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    uuid: is.Uuid(4).required(),
    reference: is
      .String(
        `${$.helpers.randomStr(3).toUpperCase()}0${$.helpers.randomInteger(
          100000,
          1000000
        )}`
      )
      .required(),
    email: joi.string().email().required(),
    password: joi.string(),
    role: is.InArray(userRoles, "user"),
  };

  // Set Model data type (optional)
  public data!: UserDataType;
}

User.on("create", async (user) => {
  const salt = await bcrypt.genSalt();
  user.data.password = await bcrypt.hash(user.data.password, salt);
});

export default User;

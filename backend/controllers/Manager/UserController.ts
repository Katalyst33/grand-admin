import { Controller, Http } from "xpresser/types/http";
import User, { UserDataType } from "../../models/User";
import { createToken } from "../../exports";
import user from "../../models/User";
import Profile from "../../models/Profile";
import Document from "../../models/Document";
const bcrypt = require("bcrypt");

/**
 * UserController
 */
export = <
  Controller.Object<{
    user: User;
  }>
>{
  // Controller Name
  name: "UserController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  async boot(http: Http) {
    const data: Record<string, any> = {};
    if (http.hasParam("userId")) {
      const userId = http.params.userId;
      data.user = await User.findOne(
        { uuid: userId },
        {
          projection: User.projectPublicFields(),
        }
      );
      //
      if (!data.user) {
        return http.status(404).send({ error: "Profile not found" });
      }
    }
    return data;
  },
  /**
   * Example Action.
   * @param http - Current Http Instance
   */
  async all(http) {
    const page = http.query("page", 1);
    const perPage = 10;
    const allUsers = await User.paginate(
      page,
      perPage,
      {},
      { projection: User.projectPublicFields() }
    );
    return http.send(allUsers);
  },

  async user(http, { user }) {
    const userProfiles = await Profile.find({ ownerId: user.data.uuid });

    return http.send({ user, userProfiles });
  },

  async xxx(http) {
    const userId = http.params.userId;
    const user = await User.findOne({ uuid: userId });

    return http.send(user);

    /*
    try {
      const user = await User.LOGIN_CHECK(userData?.email, password);
      const token = createToken(user._id);

      // http.req.headers["ge-apikey"] = token;

      return http.send({
        token,
        user: user._id,
        role: user.role,
        message: "Login was successful",
        proceed: true,
      });
    } catch (err: any) {
      return http.send({
        error: err.message,
        proceed: false,
      });
    }*/
  },
};

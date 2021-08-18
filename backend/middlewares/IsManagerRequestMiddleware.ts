import { Http } from "xpresser/types/http";
import User, { UserDataType } from "../models/User";

/**
 * IsManagerRequestMiddleware
 */
export = {
  /**
   * Default Middleware Action
   * @param {Xpresser.Http} http
   */
  async staff(http: Http) {
    let user = null;
    // run check here

    if (http.state.has("authUser")) {
      user = await User.findById(http.state.get("authUser"));
    }
    const userRoles = ["admin", "staff"];
    if (!userRoles.includes(`${user?.data.role}`)) {
      return http.toApiFalse({
        error: "You are not authorised !!",
      });
    }

    return http.next();
  },

  async admin(http: Http) {
    let user = null;
    // run check here
    if (http.state.has("authUser")) {
      user = await User.findById(http.state.get("authUser"));
    }
    if (user?.data.role !== "admin") {
      return http.toApiFalse({
        error: "You are not authorised !!",
      });
    }

    return http.next();
  },
};

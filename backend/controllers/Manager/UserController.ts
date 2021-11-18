import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";

/**
 * UserController
 */
class UserController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
  all(http: Http) {
    return http.send("all users ");
  }
}

export = UserController;

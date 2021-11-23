import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import User from "../../models/User";
import Deal from "../../models/Deal";

/**
 * UserController
 */
class UserController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
  async all(http: Http) {
    const page = http.query("page", 1);
    const perPage = 10;
    const allUsers = await User.paginate(
      page,
      perPage,
      {},
      { projection: User.projectPublicFields() }
    );
    return http.send(allUsers);
  }
}

export = UserController;

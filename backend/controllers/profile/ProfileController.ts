import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import AppConfig from "../../models/AppConfig";
import Profile from "../../models/Profile";

/**
 * ProfileController
 */
class ProfileController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
  async create(http: Http): Promise<Http.Response> {
    const body = http.$body.all();

    try {
      await Profile.new(body);
    } catch (e) {
      return http.res.send({ error: e.message });
    }

    return http.send({
      message: "Profile Updated !!",
    });
  }
}

export = ProfileController;

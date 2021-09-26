import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import JobHelper from "xpresser/dist/src/Console/JobHelper";

/**
 * SeederController
 */
class SeederController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */

  seed(http: Http) {
    // `xjs @ seed/users`

    JobHelper.dispatch("SeedUsers");

    // `xjs @ seed/users subscribers 10`
    JobHelper.dispatch("SeedUsers", ["subscribers", 10]);

    return http.send({
      route: http.route,
    });
  }
}

export = SeederController;

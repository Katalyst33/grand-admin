import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Deal from "../models/Deal";

/**
 * DealsController
 */
class DealsController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
  async all(http: Http): Promise<Http.Response> {
    const page = http.query("page", 1);

    const perPage = 2;

    const allDeals = await Deal.paginate(page, perPage);

    return http.toApi({ allDeals });

    // Pagination of all users with age >= 18, sort by firstName
  }
}

export = DealsController;

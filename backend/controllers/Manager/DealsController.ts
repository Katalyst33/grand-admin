import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Deal from "../../models/Deal";

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

  async create(http: Http): Promise<Http.Response> {
    const body = http.$body.all();
    await Deal.new(body);
    return http.send({ message: "New Deal created" });
  }

  async deal(http: Http) {
    const dealId = http.params.dealId;

    const deal = await Deal.findOne({ uuid: dealId });
    if (!deal) {
      return http.res.send({ error: "Deal not Found" });
    }

    return http.send(deal);
  }

  async update(http: Http) {
    const dealId = http.params.dealId;
    const newDeal = http.$body.all();
    console.log("new deal", newDeal);
    let deal = await Deal.findOne({ uuid: dealId });
    if (!deal) {
      return http.res.send({ error: "Customer not Found" });
    }

    await deal.update(newDeal);

    return http.send({ newDeal, message: "Deal was Edited" });
  }
  async delete(http: Http) {
    return http.send({ message: "successful" });
  }
  async updateImage(http: Http) {
    return http.send({ message: "successful" });
  }
}

export = DealsController;

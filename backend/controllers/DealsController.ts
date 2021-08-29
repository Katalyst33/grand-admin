import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Deal from "../models/Deal";
import { omitIdAndPick, pickKeys } from "xpress-mongo";

/**
 * DealsController
 */
class DealsController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
  async all(http: Http): Promise<Http.Response> {
    const search = http.query("search");
    const page = http.query("page", 1);
    let sortBy = http.query("sort") as string | string[];

    const sort = {} as Record<string, number>;
    const query = {} as Record<string, any>;

    // ***********
    if (search) {
      query.$or = [
        {
          title: new RegExp(`.*${search}.*`, "i"),
        },
        {
          description: new RegExp(`.*${search}.*`, "i"),
        },
      ];
    }

    if (sortBy) {
      const [field, direction] = (sortBy as string).split(",");
      sort[field] = direction === "asc" ? 1 : -1;
    }

    const perPage = 10;

    const promotedDeals = await Deal.native()
      .find({ promoted: true })
      .toArray();



    const allDeals = await Deal.paginate(
      page,
      perPage,
      query,

      {
        sort: sort,

        projection: Deal.projectPublicFields(),
      }
    );

    return http.toApi({ allDeals, promotedDeals });

    // Pagination of all users with age >= 18, sort by firstName
  }

  async deal(http: Http) {
    const dealId = http.params.dealId;

    const deal = await Deal.findOne(
      { uuid: dealId },
      {
        projection: Deal.projectPublicFields(),
      }
    );
    if (!deal) {
      return http.res.send({ error: "Deal not Found" });
    }

    return http.send(deal);
  }
}

export = DealsController;

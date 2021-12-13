import { Controller, Http } from "xpresser/types/http";
import Deal from "../../models/Deal";
import File from "../../models/File";
import { $ } from "../../exports";
import { log } from "util";

/**
 * DealsController
 */
export = <
  Controller.Object<{
    deal: Deal;
  }>
>{
  // Controller Name
  name: "Manager/DealsController",

  // Controller Default Error Handler.
  e: (http: Http, status: number, message: string, error: string) =>
    http.status(status).json({ status, message, error }),

  /*   async deal(http, { deal }, e) {
        console.log(e, "??");
        // return http.send(deal);
        return e(200, "deal not found", "deal found ???");
    },
*/

  async boot(http: Http) {
    const data: Record<string, any> = {};
    if (http.hasParam("dealId")) {
      const dealId = http.params.dealId;
      data.deal = await Deal.findOne(
        { uuid: dealId },
        {
          projection: Deal.projectPublicFields(),
        }
      );
      //
      if (!data.deal) {
        return http.status(404).send({ error: "Destination not found" });
      }
    }
    return data;
  },

  /**
   * Example controller action.
   * @param {Http} http
   */

  // get all destinations
  async all(http: Http): Promise<Http.Response> {
    const search = http.query("search");

    const page = http.query("page", 1);

    const perPage = 10;
    const query = {} as Record<string, any>;
    if (search) {
      query.$or = [
        {
          title: new RegExp(`.*${search}.*`, "i"),
        },
        {
          activity: new RegExp(`.*${search}.*`, "i"),
        },
        {
          description: new RegExp(`.*${search}.*`, "i"),
        },
        {
          "country.name": new RegExp(`.*${search}.*`, "i"),
        },
      ];
    }
    const allDeals = await Deal.paginate(page, perPage, query, {
      projection: Deal.projectPublicFields(),
    });

    return http.send(allDeals);

    // Pagination of all users with age >= 18, sort by firstName
  },

  //crate a new destination
  async create(http: Http): Promise<Http.Response> {
    const body = http.$body.all();
    await Deal.new(body);
    return http.send({ message: "New Destination created" });
  },

  //get a single destination
  async deal(http, { deal }, e) {
    // console.log(e, "??");
    const images = await deal.images();
    return http.send({ deal, images });
  },

  //update a single destination
  async update(http, { deal }, e) {
    const newDeal = http.$body.all();

    console.log("newDeal", newDeal);

    await deal.update(newDeal);

    return http.send({ newDeal, message: "Destination was Updated" });
  },

  //delete a single destination
  async delete(http, { deal }) {
    await deal.delete();

    return http.res.send({ message: "Destination Deleted Successfully" });
  },

  //uses selected images on destination
  async useImages(http, { deal }) {
    let imageIds = http.body<string[]>("images");
    console.log(deal, "deal");
    console.log("using images", imageIds);
    //update unique id to db (prevents repeated IDS)
    imageIds.forEach((imageId) => {
      deal.pushToArray("images", imageId, true);
    });

    await deal.save();
    return http.send({ message: "use images", deal });
  },

  async deselectImages(http, { deal }) {
    let imageId = http.body("images");
    await deal.updateRaw({
      $pull: {
        images: imageId,
      },
    });

    return http.send({ message: "deselect images" });
  },
};

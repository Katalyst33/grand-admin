import { Controller, Http } from "xpresser/types/http";
import Deal from "../../models/Deal";
import File from "../../models/File";
import { $ } from "../../exports";

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
      data.deal = await Deal.findOne({ uuid: dealId });
      //
      if (!data.deal) {
        return http.status(404).send({ error: "Deal not found" });
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
    const page = http.query("page", 1);

    const perPage = 10;

    const allDeals = await Deal.paginate(
      page,
      perPage,
      {},
      {
        projection: Deal.projectPublicFields(),
      }
    );

    return http.toApi(allDeals);

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

    await deal.update(newDeal);

    return http.send({ newDeal, message: "Destination was Updated" });
  },

  //delete a single destination
  async delete(http, { deal }) {
    await deal.delete();

    return http.res.send({ message: "Destination Deleted Successfully" });
  },

  async updateImage(http: Http) {
    return http.send({ message: "successful" });
  },

  async gallery(http: Http) {
    const images = await File.find(
      { for: "destination" },
      { sort: { createdAt: -1 } }
    );
    console.log("images");
    return http.send(images);
  },

  async deleteImages(http: Http) {
    let imageIds = http.body<string[]>("images");
    console.log(imageIds, "body ??");
    const images = await File.find({ publicId: { $in: imageIds } });
    for (let image of File.fromArray(images)) {
      const imagePath = $.path.storage(image.data.path);
      const crop100 = $.path.storage(image.data.crop["100"]);
      const crop500 = $.path.storage(image.data.crop["500"]);
      $.file.delete(imagePath);
      $.file.delete(crop100);
      $.file.delete(crop500);
      await image.delete();

      console.log({ crop100, crop500 });
    }
    await Deal.native().update({}, { $pull: { images: { $in: imageIds } } });
    return http.send({ message: "successful" });
  },

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
    // console.log(deal, "deal");
    console.log("image", imageId);
  },
};

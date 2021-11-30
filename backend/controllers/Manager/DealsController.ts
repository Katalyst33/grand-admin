import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import Deal from "../../models/Deal";
import File, { FileDataType } from "../../models/File";
import { $, folderPath } from "../../exports";

/**
 * DestinationController
 */
class DealsController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */
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
  }

  async create(http: Http): Promise<Http.Response> {
    const body = http.$body.all();
    await Deal.new(body);
    return http.send({ message: "New Destination created" });
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
      return http.res.send({ error: "Destination not Found" });
    }

    return http.send(deal);
  }

  async update(http: Http) {
    const dealId = http.params.dealId;
    const newDeal = http.$body.all();
    let deal = await Deal.findOne({ uuid: dealId });
    if (!deal) {
      return http.res.send({ error: "Destination not Found" });
    }

    await deal.update(newDeal);

    return http.send({ newDeal, message: "Destination was Updated" });
  }
  async delete(http: Http) {
    const dealId = http.params.dealId;

    const deal = await Deal.findOne({ uuid: dealId });

    if (!deal) {
      return http.res.send({ error: "Destination not Found" });
    }

    await deal.delete();

    return http.res.send({ message: "Destination Deleted Successfully" });
  }
  async updateImage(http: Http) {
    return http.send({ message: "successful" });
  }

  async gallery(http: Http) {
    const images = await File.find(
      { for: "destination" },
      { sort: { createdAt: -1 } }
    );
    console.log("images");
    return http.send(images);
  }

  async deleteImages(http: Http) {
    let imageIds = http.body<string[]>("images");
    console.log(imageIds, "body ??");
    const ids = imageIds.map((id) => File.id(id));
    const images = await File.find({ _id: { $in: ids } });
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

    return http.send({ message: "successful" });
  }
}

export = DealsController;

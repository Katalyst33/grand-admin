import { Controller, Http } from "xpresser/types/http";
import Deal from "../models/Deal";
import File from "../models/File";
import { omitIdAndPick } from "xpress-mongo";

/**
 * DestinationController
 */

export = <
  Controller.Object<{
    deal: Deal;
  }>
>{
  // Controller Name
  name: "DestinationController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

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
   * Example Action.
   * @param http - Current Http Instance
   */
  async all(http): Promise<Http.Response> {
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
        {
          activity: new RegExp(`.*${search}.*`, "i"),
        },
        {
          "country.name": new RegExp(`.*${search}.*`, "i"),
        },
      ];
    }

    if (sortBy) {
      console.log(sortBy, "sortBy here");
      const [field, direction] = (sortBy as string).split(",");
      sort[field] = direction === "asc" ? 1 : -1;
    }

    const perPage = 10;

    /* const promotedDestinations = await Deal.native()
      .find({ promoted: true }, {})
      .toArray();*/

    const promotedDestinations = await Deal.paginateAggregate(page, perPage, [
      { $match: { promoted: true } },
      {
        $lookup: {
          from: "files",
          let: {
            images: "$images",
          },
          // localField: "images",
          // foreignField: "publicId",
          as: "thumbnails",
          pipeline: [
            { $match: { $expr: { $isArray: "$$images" } } },
            { $match: { $expr: { $in: ["$publicId", "$$images"] } } },
            { $project: omitIdAndPick(["path", "crop"]) },
          ],
        },
      },
      { $project: Deal.projectPublicFields() },
    ]);
    const allDestinations = await Deal.paginate(
      page,
      perPage,
      query,

      {
        projection: Deal.projectPublicFields(),
      }
    );

    const destinations = await Deal.paginateAggregate(page, perPage, [
      { $match: query },
      {
        $lookup: {
          from: "files",
          let: {
            images: "$images",
          },
          // localField: "images",
          // foreignField: "publicId",
          as: "thumbnails",
          pipeline: [
            { $match: { $expr: { $isArray: "$$images" } } },
            { $match: { $expr: { $in: ["$publicId", "$$images"] } } },
            { $project: omitIdAndPick(["path", "crop"]) },
          ],
        },
      },
      { $project: Deal.projectPublicFields() },
    ]);
    const everyDestination = await Deal.native().find({}).count();

    // console.log(destinations.data[0], "??");
    return http.toApi({
      allDestinations: destinations,
      promotedDestinations,
      everyDestination,
    });

    // Pagination of all users with age >= 18, sort by firstName
  },

  async deal(http, { deal }, e) {
    // console.log(e, "??");
    const images = await deal.images();
    return http.send({ deal, images });
  },
};

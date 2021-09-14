import { Controller, Http } from "xpresser/types/http";
import AppConfig from "../models/AppConfig";
import User from "../models/User";
import { $ } from "../exports";

const AppController = <Controller.Object>{
  /**
   * Controller name.
   * @type {string}
   */
  name: "AppController",
  //middle ware as key and value as method that will run middle ware

  /**
   * Index Method for "/"
   * @returns {string}
   */

  async ping(http: Http): Promise<Http.Response> {
    // check if included in excluded routes

    const appData = await AppConfig.native().findOne(
      {
        $query: {},
        $orderby: { $natural: -1 },
      },
      { projection: { _id: 0, createdAt: 0 } }
    );

    //get user from server state coming from middleware ^^
    let user: User | null = http.state.get("currentUser");
    return http.send({
      appData,
      user: user?.toCollection().pick(["email", "role", "reference"]),
    });
  },

  async create(http: Http): Promise<Http.Response> {
    const body = http.$body.all();

    try {
      await AppConfig.native().deleteMany({});
      await AppConfig.new(body);
    } catch (e: any) {
      return http.res.send({ error: e.message });
    }

    return http.send({
      message: "App information Added Successfully",
    });
  },

  async update(http: Http): Promise<Http.Response> {
    return http.send({
      message: "App Information Updated Successfully",
    });
  },

  api404(http: Http): Http.Response {
    return http.toApiFalse(
      {
        error: 404,
      },
      404
    );
  },
};

module.exports = AppController;

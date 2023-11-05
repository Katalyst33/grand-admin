import { Controller, Http } from "xpresser/types/http";
import { $ } from "../exports";
import AppConfig from "../models/AppConfig";
import User from "../models/User";

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
      {},
      { projection: { _id: 0, createdAt: 0 } }
    );

    //get user from server state coming from middleware ^^
    let user: User | null = http.state.get("currentUser");
    return http.send({
      appData: {
        companyName: "Grand Eagle",
        contact: {
          phone: "+234 803 000 0000",
          email: "home@gmail.com",
          address: "No 1, Grand Eagle Street, Lagos, Nigeria",
        },
      },
      user: user?.toCollection().pick(["email", "role", "uuid"]),
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

  contactForm(http) {
    const body = http.$body.all();
    type eventResult = { status: boolean; message: string };
    $.events.emitWithCallback(
      "mailer.contactForm",
      [body],
      (eventResult: eventResult) => {
        if (!eventResult.status) http.status(500);

        return http.send({
          message: eventResult.message,
          status: eventResult.status,
        });
      }
    );

    /*setTimeout(() => {
      if (http.res.headersSent) return;
      http.res.send({
        message: "event timed out",
      });
    }, 10000);*/
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

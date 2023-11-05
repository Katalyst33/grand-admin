import { Controller, Http } from "xpresser/types/http";
import Joi from "joi";
import Amadeus from "../libs/Amadeus";

const searchSchema = Joi.object({
  from: Joi.string().required().label("From"),
  to: Joi.string().required().label("To"),
  type: Joi.string()
    .allow("one-way", "round-trip")
    .required()
    .label("Trip Type"),
  departureDate: Joi.date().required().label("Departure Date"),
});

/**
 * FlightsController
 */
export = <Controller.Object>{
  // Controller Name
  name: "FlightsController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  /**
   * Example Action.
   * @param http - Current Http Instance
   */
  async search(http) {
    type body = { from: string; to: string; type: string };
    const body = http.$body.all<body>();

    // validate body
    const { error, value } = searchSchema.validate(body);
    if (error) return http.status(400).json({ error: error.message });

    try {
      const data = await Amadeus.search({
        from: body.from,
        to: body.to,
        adults: 1,
        departureDate: "",
      });

      return {
        data,
      };
    } catch (e: any) {
      return http.status(400).json({ error: e.message });
    }
  },
};

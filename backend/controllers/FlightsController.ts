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
  // arrivalDate is required if type is round-trip
  arrivalDate: Joi.date().label("Arrival Date").when("type", {
    is: "round-trip",
    then: Joi.required(),
  }),
  adults: Joi.number().min(1).max(9).required().label("Adults"),
  children: Joi.number().min(0).max(8).label("Children"),
  infants: Joi.number().min(0).max(8).label("Infants"),
  travelClass: Joi.string()
    .allow("ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST")
    .label("Trip Class"),
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
    type body = {
      from: string;
      to: string;
      type: string;
      departureDate: string;
      arrivalDate?: string;
      adults: number;
      children?: number;
      infants?: number;
      travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    };
    const body = http.$body.all<body>();

    // validate body
    const { error, value } = searchSchema.validate(body);
    if (error) return http.status(400).json({ error: error.message });

    try {
      const data = await Amadeus.search({
        originLocationCode: body.from,
        destinationLocationCode: body.to,
        adults: body.adults,
        departureDate: body.departureDate,
        returnDate: body.arrivalDate,
        children: body.children,
        infants: body.infants,
        travelClass: body.travelClass,
      });

      return {
        data,
      };
    } catch (e: any) {
      const err = e.response ? e.response.data : e.message;
      return http.status(400).json({ error: err });
    }
  },
};

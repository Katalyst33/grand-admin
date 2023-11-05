import axios from "axios";
import env from "../configs/env";
type AmadeusSearchOption = {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  nonStop?: boolean;
  currency?: string;
  maxPrice?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
};

const amadeus = axios.create({
  baseURL:
    env.AMADEUS_MODE === "test"
      ? "https://test.api.amadeus.com"
      : "https://api.amadeus.com",
});

export default class Amadeus {
  static async search(arg: AmadeusSearchOption) {
    const { data } = await amadeus.get("/v2/shopping/flight-offers", {
      params: {
        ...arg,
        currency: "USD",
        max: 10,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          env.AMADEUS_MODE === "test"
            ? env.AMADEUS_TEST_CLIENT_SECRET
            : env.AMADEUS_LIVE_CLIENT_SECRET
        }`,
      },
    });
    return data;
  }
}

import axios, { AxiosRequestConfig } from "axios";
import env from "../configs/env";
import crypto from "crypto";
import { FileApiRequest } from "./FileApiRequest";
type AmadeusSearchOption = {
  originLocationCode?: string;
  destinationLocationCode?: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  nonStop?: boolean;
  currencyCode?: string;
  maxPrice?: number;
  travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
};

const isTest = env.AMADEUS_MODE === "test";
const API_KEY = isTest
  ? env.AMADEUS_TEST_CLIENT_ID
  : env.AMADEUS_LIVE_CLIENT_ID;
const API_SECRET = isTest
  ? env.AMADEUS_TEST_CLIENT_SECRET
  : env.AMADEUS_LIVE_CLIENT_SECRET;

const amadeus = axios.create({
  baseURL: isTest ? "https://test.api.amadeus.com" : "https://api.amadeus.com",
  // set post request headers
});

let activeToken:
  | {
      value: string;
      expires: number;
    }
  | undefined;

amadeus.interceptors.request.use((config) => {
  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken.value}`;
  }

  return config;
});

class Amadeus {
  static async setToken() {
    // if access token is not expired
    if (activeToken && activeToken.expires > Date.now()) return;

    const body = new URLSearchParams();
    body.append("grant_type", "client_credentials");
    body.append("client_id", API_KEY);
    body.append("client_secret", API_SECRET);

    const { data } = await amadeus.post("/v1/security/oauth2/token", body);

    activeToken = {
      value: data.access_token,
      expires: Date.now() + data.expires_in * 1000,
    };
  }

  static async search(arg: AmadeusSearchOption) {
    const req: AxiosRequestConfig = {
      url: "/v2/shopping/flight-offers",
      method: "GET",
      params: {
        ...arg,
        max: 20,
        currencyCode: "USD",
      },
    };

    const requestUrl = buildURL(req);
    const requestUrlHash = md5(requestUrl);

    return FileApiRequest(`${requestUrlHash}.json`, 60 * 60 * 5, async () => {
      await this.setToken();
      const { data } = await amadeus.request(req);
      return data;
    });
  }
}

function buildURL(config: any) {
  const params = new URLSearchParams(config.params).toString();
  const url = config.url;
  return params ? `${url}?${params}` : url.toString();
}

function md5(str: string) {
  // creat eusing node crypto
  const hash = crypto.createHash("md5");
  // update hash with string
  hash.update(str);
  // return hash digest
  return hash.digest("hex");
}

export default Amadeus;

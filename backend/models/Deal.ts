import {
  is,
  XMongoSchema,
  XMongoModel,
  RefreshDateOnUpdate,
} from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";
import MainModel from "./MainModel";
import File from "./File";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface DealDataType {
  updatedAt?: Date;
  createdAt: Date;
  title: string;
  uuid: string;
  description: string;
  country: {
    code: string;
    name: string;
  };

  duration: {
    start: Date;
    end: Date;
  };
  featured: boolean;
  price: number;
  images: string[];
  enabled: boolean;
}

/**
 * Deal Model
 * Collection: `deals`
 */
class Deal extends MainModel {
  // Set Model Schema
  static publicFields = [
    "title",
    "description",
    "uuid",
    "images",
    "image",
    "price",
    "included",
    "country",
    "activity",
    "duration",
    "promoted",
    "enabled",
  ];
  static schema: XMongoSchema = {
    uuid: is.Uuid(4).required(),
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    title: is.String().required(),
    description: is.String().required(),

    country: is.Object(() => ({
      code: null,
      name: null,
    })),
    countryCode: is.String(),
    duration: is.Object(() => ({
      start: is.Date(),
      end: is.Date(),
    })),
    expiresIn: is.Date(),
    activity: is.String(),
    images: is.Array(),
    price: is.Number(),
    included: is.String(),
    enabled: is.Boolean(),
    promoted: is.Boolean(false),
  };

  public data!: DealDataType;

  async images() {
    return File.find({
      publicId: {
        $in: this.data.images || [],
      },
    });
  }
}

/**
 * Map Model to Collection: `deals`
 * .native() will be made available for use.
 */
UseCollection(Deal, "deals");

RefreshDateOnUpdate(Deal, "updatedAt");

export default Deal;

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
  thumbnail: string;
  activity: string;
  status: "pending" | "active" | "expired";
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
    "thumbnail",
    "price",
    "image",
    "included",
    "country",
    "activity",
    "duration",
    "promoted",
    "enabled",
    "thumbnails",
    "active",
    "status",
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
    thumbnail: is.String("destinations/no-destination.jpeg"),
    images: is.Array(),
    price: is.Number(),
    included: is.String(),
    enabled: is.Boolean(true),
    promoted: is.Boolean(false),
    status: is.String("pending"),
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

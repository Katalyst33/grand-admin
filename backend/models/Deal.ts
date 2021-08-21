import {
  is,
  XMongoSchema,
  XMongoModel,
  RefreshDateOnUpdate,
} from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface DealDataType {
  updatedAt?: Date;
  createdAt: Date;
  title: string;
  description: string;
  country: string;
  expiresIn: Date;
  price: number;
  image: string;
  enabled: boolean;
}

/**
 * Deal Model
 * Collection: `deals`
 */
class Deal extends XMongoModel {
  // Set Model Schema
  static schema: XMongoSchema = {
    uuid: is.Uuid(4).required(),
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    reference: is.String().required(),
    title: is.String().required(),
    description: is.String().required(),
    country: is.String(),
    countryCode: is.String(),
    expiresIn: is.Date(),
    image: is.String(),
    price: is.Number(),
    included: is.Array(),
    enabled: is.Boolean(),
  };

  public data!: DealDataType;
}

/**
 * Map Model to Collection: `deals`
 * .native() will be made available for use.
 */
UseCollection(Deal, "deals");

RefreshDateOnUpdate(Deal, "updatedAt");

export default Deal;

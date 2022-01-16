import { is, XMongoSchema, XMongoModel } from "xpress-mongo";
import { UseCollection } from "@xpresser/xpress-mongo";

/**
 * Interface for Model's `this.data`.
 * Optional if accessing data using model helper functions
 */
export interface CartDataType {
  updatedAt?: Date;
  createdAt: Date;
  uuid: string;
  ownerId?: string;
  destinationId?: string;
}

/**
 * Cart Model
 * Collection: `carts`
 */
class Cart extends XMongoModel {
  // Set Model Schema
  static schema: XMongoSchema = {
    updatedAt: is.Date(),
    createdAt: is.Date().required(),
    uuid: is.Uuid(4).required(),
    ownerId: is.String().required(),
    destinationId: is.String().required(),
  };

  public data!: CartDataType;
}

/**
 * Map Model to Collection: `carts`
 * .native() will be made available for use.
 */
UseCollection(Cart, "carts");

export default Cart;

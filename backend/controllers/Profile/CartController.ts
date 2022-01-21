import { Controller, Http } from "xpresser/types/http";
import Cart from "../../models/Cart";
import { is } from "xpress-mongo";
import Deal, { DealDataType } from "../../models/Deal";

/**
 * CartController
 */
export = <Controller.Object>{
  // Controller Name
  name: "CartController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  /**
   * Example Action.
   * @param http - Current Http Instance
   */
  async addToCart(http) {
    const body = http.$body.all();

    const cart = await Cart.find({
      ownerId: body.ownerId,
      destinationId: body.destinationId,
    });

    if (cart.length) {
      return http.send({
        message: "Destination has already been saved",
        cart,
      });
    } else {
      await Cart.new(body);
      return http.send({
        message: "Destination has been saved",
      });
    }

    /*   return http.send({
      message: "cart saved to profile",
      cart,
    });*/
  },
  async getOneCart(http) {
    const body = http.$body.all();

    const cart = await Cart.findOne({
      ownerId: body.ownerId,
      destinationId: body.destinationId,
    });
    console.log(cart, "body");

    if (cart) {
      return http.send({
        isAdded: true,
      });
    } else {
      return http.send({
        isAdded: false,
      });
    }

    /*  return http.send({
      message: "testing saved to profile",
      body,
    });*/
  },

  async getCart(http) {
    console.log("get cart");
    const body = http.$body.all();
    const cart = await Cart.find({ ownerId: body.ownerId });
    let allDestinations = [] as any;

    for (const item of cart) {
      let oneDestination = await Deal.findOne({
        uuid: item.destinationId,
      });
      allDestinations.push(oneDestination);
    }

    return http.send({
      allDestinations,
    });
  },

  async removeFromCart(http) {
    const body = http.$body.all();

    const cart = await Cart.findOne({
      ownerId: body.ownerId,
      destinationId: body.destinationId,
    });
    console.log(cart);
    if (cart) {
      await cart?.delete();

      return http.send({
        message: "Destination has been removed from wishlist",
      });
    } else {
      return http.send({
        message: "Destination does not exist",
      });
    }
  },
};

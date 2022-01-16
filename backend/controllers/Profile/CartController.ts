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

    await Cart.new(body);

    return http.send({
      message: "cart saved to profile",
    });
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
      await allDestinations.push(oneDestination);
    }

    return http.send({
      allDestinations,
    });
  },

  async removeFromCart(http) {
    const body = http.$body.all();
    //get all user cart items
    const cart = await Cart.find({
      ownerId: body.ownerId,
      destinationId: body.destinationId,
    });

    // remove item from cart
    /*    const newArray = cart.filter((item) => {
      return item.productId !== body.productId;
    });*/

    console.log(cart);

    return http.send({
      cart,
    });
  },
};

import { ControllerClass } from "xpresser";
import { Http } from "xpresser/types/http";
import User from "../models/User";
import Joi from "joi";

const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: any) => {
  return jwt.sign({ id }, "actionfilm", {
    expiresIn: maxAge,
  });
};

/**
 * UserController
 */
class UserController extends ControllerClass {
  /**
   * Example controller action.
   * @param {Http} http
   */

  async register(http: Http): Promise<Http.Response> {
    let body = http.$body.all();

    // await User.native().deleteMany({});

    try {
      //validate data from front end
      body = Joi.attempt(
        body,
        Joi.object({
          email: Joi.string().email().error(new Error("Email is not valid")),
          password: Joi.string()
            .pattern(/^[a-zA-Z0-9]{5,30}$/)
            .error(new Error("Password is not valid")),
          repeat_password: Joi.string()
            .required()
            .valid(Joi.ref("password"))
            .error(new Error("password does not match")),
        })
      );
      //check for existing user or email
      const existingUser = await User.count({
        email: body.email,
      });
      if (existingUser) {
        throw new Error("Email has been taken");
      }

      const { data } = await User.new(body);
      //genrate token
      const token = createToken(data._id);
      http.res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      });
      // console.log(data, 'json part');

      return http.send({
        data,
        message: "Registration successful",
      });
    } catch (e) {
      console.log(e);
      return http.send({ error: e.message });
    }
  }

  async login(http: Http): Promise<Http.Response> {
    const { email, password } = http.$body.all();

    try {
      // @ts-ignore

      const user = await User.LOGIN_CHECK(email, password);
      const token = createToken(user._id);

      return http.send({
        token,
        user: user._id,
        role: user.role,
        message: "Login was successful",
        proceed: true,
      });
    } catch (err) {
      return http.send({
        error: err.message,
        proceed: false,
      });
    }
  }

  async logout(http: Http): Promise<Http.Response> {
    console.log("looog", http.state.get("authUser"));
    // http.state.set('authUser', {})

    /*     http.res.cookie('jwt', '', {
            maxAge: 1,
        });*/
    // http.res.redirect('/');

    return http.send({
      message: "you have been logout",
    });
  }
}

export = UserController;

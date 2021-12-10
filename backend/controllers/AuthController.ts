import { Controller, Http } from "xpresser/types/http";
import Joi from "joi";
import User from "../models/User";
import Profile from "../models/Profile";
import { createToken, maxAge } from "../exports";

/**
 * AuthController
 */
export = <Controller.Object>{
  // Controller Name
  name: "AuthController",

  // Controller Default Error Handler.
  e: (http: Http, error: string) => http.status(401).json({ error }),

  /**
   * Example Action.
   * @param http - Current Http Instance
   */

  async register(http: Http) {
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
      console.log(data, " > profile");

      // console.log(Profile, "new user data");

      //generate token
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
    } catch (e: any) {
      console.log(e);
      return http.send({ error: e.message });
    }
  },

  async login(http) {
    const { email, password } = http.$body.all();

    try {
      const user = await User.LOGIN_CHECK(email, password);
      const token = createToken(user._id);

      // http.req.headers["ge-apikey"] = token;

      return http.send({
        token,
        user: user._id,
        role: user.role,
        message: "Login was successful",
        proceed: true,
      });
    } catch (err: any) {
      return http.send({
        error: err.message,
        proceed: false,
      });
    }
  },

  async logout(http) {
    console.log("logOut", http.state.get("authUser"));
    // http.state.set('authUser', {})

    /*     http.res.cookie('jwt', '', {
                    maxAge: 1,
                });*/
    // http.res.redirect('/');

    return http.send({
      message: "you have been logout",
    });
  },
};

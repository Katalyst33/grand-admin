import { Controller, Http } from "xpresser/types/http";
import Joi from "joi";
import User, { UserDataType } from "../models/User";
import Profile from "../models/Profile";
import { $, createToken, maxAge } from "../exports";
const bcrypt = require("bcrypt");
import moment from "moment";

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
          username: Joi.string().required(),
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

      const numberOfUsers = await User.count();
      const { data } = await User.new({
        ...body,
        ...{ role: numberOfUsers === 0 ? "admin" : "user" },
      });
      $.events.emit("mailer.onRegistration", data);
      //send email to user

      return http.send({
        data,
        message: "Registration successful",
      });
      //make first user admin
    } catch (e: any) {
      console.log(e);
      return http.status(400).send({ error: e.message });
    }
  },

  /*async login(http, e) {
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
      return http.status(400).send({
        error: err.message,
      });
    }
  },*/

  async login(http, e) {
    const { email, password } = http.$body.all();

    try {
      const user = await User.findOne({ email });

      if (user) {
        const auth = await bcrypt.compare(password, user.data.password);

        if (auth) {
          const token = createToken(user.data._id);
          await user.update({
            lastSeenAt: new Date(),
          });

          $.events.emit("mailer.onRegistration");

          return http.send({
            token,
            user: user.data._id,
            role: user.data.role,
            message: "Login was successful",
            proceed: true,
          });
        } else {
          throw new Error("Password is incorrect");
        }
      } else {
        throw new Error("This user does not exist");
      }
    } catch (err: any) {
      return http.status(400).send({
        error: err.message,
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

  async forgotPassword(http, boot, e) {
    const userEmail = http.$body.get("email");
    console.log(userEmail);

    const user = (await User.findOne({ email: userEmail }))!;

    if (!user) {
      return http.status(400).send({
        error: "This user does not exist",
      });
    }
    if (user.data.passwordReset) {
      const sentAt = moment(user.data.passwordReset.sentAt);
      const OneMinuteAgo = moment().subtract(1, "minute");

      if (sentAt.isAfter(OneMinuteAgo)) {
        const secondsRemaining = sentAt.diff(OneMinuteAgo, "seconds");
        return e(
          `Please wait for (${secondsRemaining}) seconds and try again.`
        );
      }
    }

    console.log("got here");

    await user.update(<UserDataType>{
      passwordReset: {
        code: String(http.$("helpers").randomInteger(111111, 999999)),
        sentAt: new Date(),
      },
    });

    $.events.emit("mailer.forgotPassword", user);

    return {
      user,
      message: "Your Password reset code has been sent to your email address.",
    };
  },

  async resetPassword(http, boot, e) {
    const { email, reset_code, password } = http.$body.all() || {};
    //
    const user = (await User.findOne({ email }))!;

    console.log(email, reset_code, password);

    if (user.data.passwordReset) {
      if (user.data.passwordReset.code !== reset_code)
        return e(`Invalid reset code!`);

      const sentAt = moment(user.data.passwordReset.sentAt);
      const TenMinutesAgo = moment().subtract(10, "minutes");
      console.log(sentAt, TenMinutesAgo);

      if (sentAt.isBefore(TenMinutesAgo)) {
        return e(`Reset code has expired!`);
      }
    } else {
      return e(`No password request found on this account.`);
    }

    // Update Password
    await user.update({ password: bcrypt.hashSync(password, 10) });

    // Unset PasswordReset
    await user.unset("passwordReset");

    return { message: "Your password reset was successful." };
  },
};

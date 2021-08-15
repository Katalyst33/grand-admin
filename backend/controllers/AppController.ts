import { Controller, Http } from 'xpresser/types/http';
import AppConfig from '../models/AppConfig';
import User from '../models/User';
import { $ } from '../exports';

const AppController = <Controller.Object>{
  /**
   * Controller name.
   * @type {string}
   */
  name: 'AppController',

  /**
   * Index Method for "/"
   * @returns {string}
   */



  async ping(http: Http): Promise<Http.Response> {
    // check if included in excluded routes

    const appData = await AppConfig.native().findOne(
      {
        $query: {},
        $orderby: { $natural: -1 },
      },
      { projection: { _id: 0 } }
    );
    let user: User | null = null;

    if (http.state.has('authUser')) {
      user = await User.findById(http.state.get('authUser'), {
        projection: {
          email: 1,
          _id: 0,
        },
      });
    }

    return http.send({ user, appData });
  },

  async create(http: Http): Promise<Http.Response> {

    const body = http.$body.all();

    try {
      await AppConfig.native().deleteMany({});
      await AppConfig.new(body);
    } catch (e) {
      return http.res.send({ error: e.message });
    }

    return http.send({
      message: 'App Data Added Successfully',
    });
  },
  async setCookie(http: Http): Promise<Http.Response> {
    http.res.cookie('newUser', false);
    http.res.cookie('isEmployee', true, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    return http.send('you got cookies');
  },

  async readCookie(http: Http): Promise<Http.Response> {
    const bigCookie = http.req.cookies;
    console.log(bigCookie.newUser);
    return http.res.json(bigCookie);
    // return http.send('you got cookies');
  },

  async contactMail(http) {
    const formData = http.$body.all();

    $.events.emit('Contact.sendMail', http, formData);
    return http.res.send({
      msg: 'Contact mail has been sent',
    });
  },

  api404(http: Http): Http.Response {
    return http.toApiFalse(
      {
        error: 404,
      },
      404
    );
  },
};

module.exports = AppController;

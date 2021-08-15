import { Http } from 'xpresser/types/http';
import User from '../models/User';
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: any) => {
  return jwt.sign({ id }, 'actionfilm', {
    expiresIn: maxAge,
  });
};

/**
 * UserAuthMiddleware
 */
export = {
  /**
   * Default Middleware Action
   * @param {Xpresser.Http} http
   */

  requireAuth(http: Http) {
    // get and validate authToken
    const authToken = http.req.cookies.jwt;
    console.log("CHECK !!!!",http.req.cookies)
    const currentUrl = http.req.originalUrl;

    if (currentUrl.indexOf('/api/history/') === 0) {
      return http.next();
    }
    const skip = ['/api/ping'];

    // Skip routes in excluded routes
    if (skip.includes(currentUrl) && !authToken) return http.next();

    if (!authToken) {
      return http.toApiFalse({
        next: 'logout',
        error: 'Token not found, Access Denied!',
      });
    }

    let data: any;

    try {
      data = jwt.verify(authToken, 'actionfilm');
      // set authUsername

      http.state.set('authUser', User.id(data.id));
    } catch {
      return http.toApiFalse({
        next: 'logout',
        error: 'Session Expired!',
      });
    }

    return http.next();
  },
};

import {Http} from 'xpresser/types/http';
import User from '../models/User';

const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id: any) => {
    return jwt.sign({id}, 'actionfilm', {
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



    requireBasic(http: Http) {
        const skip = ['/api/ping'];

        const authToken = http.req.headers['ge-apikey']

        const currentUrl = http.req.originalUrl;


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

            http.next();
        } catch {
            return http.toApiFalse({
                next: 'logout',
                error: 'Session Expired!',
            });
        }

    },


  async  getCurrentUser(http:Http){


        if (http.state.has('authUser')) {
          const  user = await User.findById(http.state.get('authUser'));

          http.state.set('currentUser', user)
        }

        return http.next()

    }
};

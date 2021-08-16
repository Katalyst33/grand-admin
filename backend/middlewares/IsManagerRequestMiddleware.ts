import {Http} from "xpresser/types/http";

/**
 * IsManagerRequestMiddleware
 */
export = {

    /**
    * Default Middleware Action
    * @param {Xpresser.Http} http
    */
    staff(http: Http): any {
        // run check here

        console.log('is staff')

        return http.next();
    },

    admin(http: Http): any {
        console.log('is admin only')

        return http.next();

    }

};

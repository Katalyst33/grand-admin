import {ControllerClass} from "xpresser";
import {Http} from "xpresser/types/http";
import Deal from "../models/Deal";

/**
 * DealsController
 */
class DealsController extends ControllerClass {

    /**
     * Example controller action.
     * @param {Http} http
     */

    async create(http: Http): Promise<Http.Response> {
        const body = http.$body.all();
        await Deal.new(body);
        return http.send({ message: 'New Deal created' });
    }

}

export = DealsController;

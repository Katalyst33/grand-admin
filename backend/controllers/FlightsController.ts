import {Controller, Http} from "xpresser/types/http";
import Joi from "joi";

const searchSchema = Joi.object({
    from: Joi.string().required().label("From"),
    to: Joi.string().required().label("To"),
    type: Joi.string().allow("one-way", "round-trip").required().label("Trip Type"),
})

/**
 * FlightsController
 */
export = <Controller.Object>{
    // Controller Name
    name: "FlightsController",

    // Controller Default Error Handler.
    e: (http: Http, error: string) => http.status(401).json({ error }),


    /**
    * Example Action.
    * @param http - Current Http Instance
    */
    search(http) {
        const body = http.$body.all();

        // validate body
        const {error, value} = searchSchema.validate(body);
        if (error) return http.status(400).json({error: error.message});


        return http.send({
            route: http.route
        });
    }
};

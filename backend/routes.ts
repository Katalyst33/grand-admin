import {getInstanceRouter} from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */

import UserRoutes from './routes/UserRoutes';

const Router = getInstanceRouter();

UserRoutes();
Router.path('/api/', () => {
    require('./routes/AppRoutes');

}).middlewares(['UserAuth.requireBasic']);


Router.routesAfterPlugins = () => {
    Router.any('/api/*', 'AppController@api404');

    Router.sendFile('/*', 'dist/index.html');
};




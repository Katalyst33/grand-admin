import {getInstanceRouter} from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */

import UserRoutes from './routes/UserRoutes';

const router = getInstanceRouter();

UserRoutes();

router.path('/api', () => {
    require('./routes/AppRoutes');

    require('./routes/admin.routes')

}).middlewares(['UserAuth.requireBasic']);

// Api Routes



router.routesAfterPlugins = () => {
    router.any('/api/*', 'AppController@api404');

    router.sendFile('/*', 'dist/index.html');
};




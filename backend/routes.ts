import {getInstanceRouter} from "xpresser";
/**
 * See https://xpresserjs.com/router/
 */
const Route = getInstanceRouter();

/**
 * Url: "/" points to AppController@index
 * The index method of the controller.
 */




import UserRoutes from './routes/UserRoutes';

const Router = getInstanceRouter();
UserRoutes();

Router.path('/api/', () => {
    require('./routes/AppRoutes');
});


Router.routesAfterPlugins = () => {
    Router.any('/api/*', 'AppController@api404');
    // Route.get('/*', 'App@index');
    Router.sendFile('/*', 'dist/index.html');
};

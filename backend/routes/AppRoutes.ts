import { getInstanceRouter } from 'xpresser';
const Router = getInstanceRouter();

Router.get('ping', 'App@ping');
Router.post('app-data', 'App@create');

import { getInstanceRouter } from 'xpresser';
const Router = getInstanceRouter();

Router.get('ping', 'App@ping');
Router.post('app-data', 'App@create');
Router.post('contact-mail', 'App@contactMail');
Router.get('set-cookies', 'App@setCookie');
Router.get('read-cookies', 'App@readCookie');

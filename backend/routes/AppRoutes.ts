import { getInstanceRouter } from 'xpresser';
const Router = getInstanceRouter();

Router.get('ping', 'App@ping');
Router.post('app-data', 'App@postData');
Router.post('contact-mail', 'App@contactMail');
Router.get('set-cookies', 'App@setCookie');
Router.get('read-cookies', 'App@readCookie');

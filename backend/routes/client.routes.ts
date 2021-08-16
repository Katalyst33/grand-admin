import { getInstanceRouter } from 'xpresser';
const router = getInstanceRouter();


router.path('', () => {
    router.post('@register');
    router.post('@login');
    router.get('@logout');
}).controller('User');





router.path('', () => {

    router.get('@ping');
}).controller('App').middlewares(['UserAuth.requireBasic','UserAuth.getCurrentUser']);


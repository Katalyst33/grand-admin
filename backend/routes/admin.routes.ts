import { getInstanceRouter } from 'xpresser';
const router = getInstanceRouter();

router.path("/deals*").middleware(['UserAuth.requireBasic']);



router.path('/deals/', () => {
    router.post('@create');

}).controller('Deals');


router.path('', () => {
    router.post('@create');
    router.patch('@update');
}).controller('App').middleware(['IsManagerRequest.admin']);



router.post('create', 'App@create');

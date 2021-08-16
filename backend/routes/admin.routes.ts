import { getInstanceRouter } from 'xpresser';
const router = getInstanceRouter();

router.path("/deals*").middleware(['UserAuth.requireBasic']);


//create deals/ packages
router.path('/deals/', () => {
    router.post('@create');

}).controller('Deals').middlewares(['IsManagerRequest.staff']);


//create app /company infor mation
router.path('', () => {
    router.post('@create');
    router.patch('@update');
}).controller('App').middleware(['IsManagerRequest.admin']);



router.post('create', 'App@create');

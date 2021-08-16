import { getInstanceRouter } from 'xpresser';
const router = getInstanceRouter();



router.path('/deals/', () => {
    router.post('@create');

}).controller('Deals');

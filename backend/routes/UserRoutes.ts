import { getInstanceRouter } from 'xpresser';
const router = getInstanceRouter();

export default function UserRoutes() {
    // User Routes
    router.path('/api/', () => {
        router.post('@register');
        router.post('@login');
        router.get('@logout');
    }).controller('User');

}



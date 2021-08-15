import { getInstanceRouter } from 'xpresser';
const Route = getInstanceRouter();

export default function UserRoutes() {
    // Shipment Routes
    Route.post('/api/register', 'User@register');
    Route.post('/api/login', 'User@login');
    Route.get('/api/logout', 'User@logout');

}

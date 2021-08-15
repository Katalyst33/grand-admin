import { getInstanceRouter } from 'xpresser';
const Route = getInstanceRouter();

export default function ShipmentRoutes() {
    // Shipment Routes
    Route.post('/api/signup', 'User@signup');
    Route.post('/api/login', 'User@login');
    Route.get('/api/logout', 'User@logout');


}

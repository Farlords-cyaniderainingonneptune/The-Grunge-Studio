import authRoutes from './routes.auth.js';
import adminRoutes from './routes.admin.js';
import statusRoutes from './routes.status control.js'
import songRoutes from './routes.songs.js';
import reviewRoutes from './routes.reviews.js';

const routes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/admin', adminRoutes);
    app.use('/api/v1/status', statusRoutes);
    app.use('/api/v1/songs', songRoutes);
    app.use('/api/v1/reviews', reviewRoutes);
}

export default routes;

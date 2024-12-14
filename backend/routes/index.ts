import express from 'express';
import authRoutes from './auth';
import taskRoutes from './tasks';
import dataRoutes from './data';
const routes = express.Router();

routes.use('/api/auth',authRoutes);

routes.use('/api/task',taskRoutes);

routes.use('/api/data',dataRoutes);

export default routes;
import { FastifyInstance } from 'fastify';
import { customerRoutes } from './routes/customer/customerRoutes';

export const app = async (fastify: FastifyInstance) => {
    fastify.register(customerRoutes);
};

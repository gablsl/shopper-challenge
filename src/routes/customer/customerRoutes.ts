import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import { getCustomer } from '../../controller/customer/customerController';

type Handler = (req: FastifyRequest, res: FastifyReply) => Promise<void>;

export const customerRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.get('/:customer_code/list', getCustomer as Handler);
};

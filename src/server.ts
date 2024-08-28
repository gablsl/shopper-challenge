import Fastify from 'fastify';
import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();
const fastify = Fastify({ logger: true });

const start = async () => {
    try {
        await app(fastify);
        await fastify.listen({
            port: Number(process.env.FASTIFY_PORT),
            host: '0.0.0.0',
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();

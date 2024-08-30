import { FastifyRequest } from 'fastify';

export type CustomerRequest = FastifyRequest & {
    params: {
        customer_code: string;
    };
    query: {
        measure_type: string;
    };
    body: {
        measure_uuid: string;
        confirmed_value: number;
        image: string;
        customer_code: string;
        measure_datetime: string;
        measure_type: string;
    };
};

export type MeasureType = {
    measure_type: string;
};

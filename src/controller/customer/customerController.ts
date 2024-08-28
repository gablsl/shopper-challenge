import { FastifyReply, FastifyRequest } from 'fastify';
import { readCustomer } from '../../services/customer/customerService';

type CustomerRequest = FastifyRequest & {
    params: {
        customer_code: string;
    };
    query: {
        measure_type: string;
    };
};

export const getCustomer = async (req: CustomerRequest, res: FastifyReply) => {
    try {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        if (!customer_code) {
            res.code(404).send({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada',
            });
        }

        // TODO: Fazer ficar case insensitive
        if (measure_type && !['WATER', 'GAS'].includes(measure_type)) {
            res.code(400).send({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida',
            });
        }

        const customer = await readCustomer(customer_code);

        if (measure_type) {
            const filteredCustomer = customer?.measures.filter(
                (measure) => measure.measure_type === measure_type
            );

            res.code(200).send(filteredCustomer);
        }
        res.code(200).send(customer);
    } catch (err) {
        res.code(500).send({
            error_code: 'SERVER_ERROR',
            error_description: 'Houve um erro no servidor',
        });
    }
};

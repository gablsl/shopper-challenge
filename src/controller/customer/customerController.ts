import { FastifyReply, FastifyRequest } from 'fastify';
import {
    readCustomer,
    readMeasure,
    updateHasConfirmed,
} from '../../services/customer/customerService';

type CustomerRequest = FastifyRequest & {
    params: {
        customer_code: string;
    };
    query: {
        measure_type: string;
    };
    body: {
        measure_uuid: string;
        confirmed_value: number;
    };
};

// * Não finalizado ainda
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

        // TODO: Tornar o measure_type case insensitive
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

export const patchCustomer = async (
    req: CustomerRequest,
    res: FastifyReply
) => {
    const { measure_uuid, confirmed_value } = req.body;

    const measure = await readMeasure(measure_uuid);

    if (!measure_uuid || !confirmed_value) {
        res.code(400).send({
            error_code: 'INVALID_DATA',
            error_description:
                'Os dados fornecidos no corpo da requisição são inválidos',
        });
    }

    if (measure?.has_confirmed === true) {
        res.code(409).send({
            error_code: 'CONFIRMATION_DUPLICATE',
            error_description: 'Leitura do mês já confirmada',
        });
    }

    if (!measure) {
        res.code(404).send({
            error_code: 'MEASURE_NOT_FOUND',
            error_description: 'Leitura do mês já realizada',
        });
    }

    await updateHasConfirmed(measure_uuid, confirmed_value);

    res.code(200).send({ success: true });
};

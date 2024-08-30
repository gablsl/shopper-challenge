import { measureExists } from './../../services/customer/customerService';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
    createCustomer,
    createUpload,
    findCustomer,
    readCustomer,
    readMeasure,
    updateHasConfirmed,
} from '../../services/customer/customerService';
import { getDateRange } from '../../utils/dateUtils';
import { uploadToGemini } from '../../utils/uploadToGemini';

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
        image: string;
        customer_code: string;
        measure_datetime: string;
        measure_type: string;
    };
};

export const getCustomer = async (req: CustomerRequest, res: FastifyReply) => {
    try {
        const { customer_code } = req.params;
        const { measure_type } = req.query;

        const customer = await readCustomer(customer_code);

        if (!customer) {
            return res.code(404).send({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada',
            });
        }

        if (
            measure_type &&
            !['WATER', 'GAS'].includes(measure_type.toUpperCase())
        ) {
            return res.code(400).send({
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida',
            });
        }

        if (measure_type) {
            const measures = customer?.measures.filter(
                (measure) => measure.measure_type === measure_type.toUpperCase()
            );

            const response = { customer_code, measures };
            return res.code(200).send(response);
        }
        return res.code(200).send(customer);
    } catch (err) {
        return res.code(500).send({
            error_code: 'SERVER_ERROR',
            error_description: 'Houve um erro no servidor',
        });
    }
};

export const postUpload = async (req: CustomerRequest, res: FastifyReply) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } =
            req.body;

        if (!image || !customer_code || !measure_datetime || !measure_type) {
            return res.code(400).send({
                error_code: 'INVALID_DATA',
                error_description:
                    'Os dados fornecidos no corpo da requisição são inválidos',
            });
        }

        let customer = await findCustomer(customer_code);
        if (!customer) {
            customer = await createCustomer(customer_code);
        }

        const date = new Date(measure_datetime);

        const { startOfMonth, endOfMonth } = getDateRange(date);

        const measureDate = await measureExists(
            measure_type,
            startOfMonth,
            endOfMonth
        );

        if (measureDate) {
            return res.code(409).send({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mes já realizada',
            });
        }

        const measure_value = await uploadToGemini(image);

        const value = Number(measure_value.measurementText);

        const measure = await createUpload(customer?.customer_code, {
            image,
            image_url: measure_value.tempFilePath,
            measure_datetime: date,
            measure_type,
            measure_value: value,
        });

        return res.code(200).send({
            image_url: measure_value.tempFilePath,
            measure_value: measure.measure_value,
            measure_uuid: measure.measure_uuid,
        });
    } catch (err) {
        return res.code(500).send({
            error_code: 'SERVER_ERROR',
            error_description: 'Houve um erro no servidor',
        });
    }
};

export const patchCustomer = async (
    req: CustomerRequest,
    res: FastifyReply
) => {
    try {
        const { measure_uuid, confirmed_value } = req.body;

        const measure = await readMeasure(measure_uuid);

        if (!measure?.measure_uuid || !confirmed_value) {
            res.code(400).send({
                error_code: 'INVALID_DATA',
                error_description:
                    'Os dados fornecidos no corpo da requisição são inválidos',
            });
        }

        if (measure?.has_confirmed === true) {
            return res.code(409).send({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura do mês já realizada',
            });
        }

        if (!measure) {
            return res.code(404).send({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura do mês já realizada',
            });
        }

        await updateHasConfirmed(measure_uuid, confirmed_value);

        return res.code(200).send({ success: true });
    } catch (err) {
        return res.code(500).send({
            error_code: 'SERVER_ERROR',
            error_description: 'Houve um erro no servidor',
        });
    }
};

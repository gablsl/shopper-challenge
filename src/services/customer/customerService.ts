import prisma from '../../client';

export const readCustomer = async (customer_code: string) => {
    return await prisma.customer.findUnique({
        where: {
            customer_code,
        },
        include: {
            measures: true,
        },
    });
};

export const readMeasure = async (measure_uuid: string) => {
    return await prisma.measure.findUnique({
        where: {
            measure_uuid,
        },
    });
};

export const updateHasConfirmed = async (
    measure_uuid: string,
    measure_value: number
) => {
    return await prisma.measure.update({
        where: {
            measure_uuid,
        },
        data: {
            measure_value,
            has_confirmed: true,
            confirmed_value: measure_value,
        },
    });
};

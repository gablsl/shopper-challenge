import prisma from '../../client';

export const readCustomer = async (customer_code: string) => {
    return await prisma.customer.findUnique({
        where: {
            customer_code,
        },
        select: {
            customer_code: true,
            measures: {
                select: {
                    measure_uuid: true,
                    measure_datetime: true,
                    measure_type: true,
                    has_confirmed: true,
                    image_url: true,
                },
            },
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
    confirmed_value: number
) => {
    return await prisma.measure.update({
        where: {
            measure_uuid,
        },
        data: {
            confirmed_value,
            has_confirmed: true,
        },
    });
};

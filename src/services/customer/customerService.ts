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

export const createCustomer = async (customer_code: string) => {
    return await prisma.customer.create({
        data: {
            customer_code,
        },
    });
};

export const findCustomer = async (customer_code: string) => {
    return await prisma.customer.findUnique({
        where: {
            customer_code,
        },
    });
};

export const createUpload = async (
    customer_code: string,
    measureData: {
        measure_datetime: Date;
        image: string;
        image_url: string;
        measure_type: string;
        measure_value: number;
    }
) => {
    return await prisma.measure.create({
        data: { customerCustomer_code: customer_code, ...measureData },
    });
};

export const measureExists = async (
    measure_type: string,
    startOfMonth: Date,
    endOfMonth: Date
) => {
    return await prisma.measure.findFirst({
        where: {
            measure_type,
            measure_datetime: {
                gte: startOfMonth,
                lt: endOfMonth,
            },
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
            measure_value: confirmed_value,
            has_confirmed: true,
        },
    });
};

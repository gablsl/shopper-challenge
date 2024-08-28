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

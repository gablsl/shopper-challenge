export const getDateRange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    return {
        startOfMonth,
        endOfMonth,
    };
};

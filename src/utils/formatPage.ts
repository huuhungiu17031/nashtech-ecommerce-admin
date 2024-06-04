export const formatPage = (page: string) => {
    return parseInt(page, 10) >= 1 ? (parseInt(page, 10) - 1).toString() : '0';
};

export const formatPrice = ({
    price,
    locales = 'vi-VN',
    currency = 'VND',
}: {
    price: number;
    locales?: string;
    style?: string;
    currency?: string;
}) => {
    return (
        price &&
        price.toLocaleString(locales, {
            style: 'currency',
            currency,
        })
    );
};

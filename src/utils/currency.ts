export const formatPrice = ({
    price,
    locales = 'vi-VN',
    style = 'currency',
    currency = 'VND',
}: {
    price: number;
    locales?: string;
    style?: string;
    currency?: string;
}) => {
    console.log(price);
    return (
        price &&
        price.toLocaleString(locales, {
            style,
            currency,
        })
    );
};

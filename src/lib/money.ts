import { ShopifyMoney } from './shopify';

export function formatMoney(money: ShopifyMoney): string {
    const amount = parseFloat(money.amount);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: money.currencyCode,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function formatPrice(amount: string, currencyCode: string = 'USD'): string {
    const value = parseFloat(amount);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 2,
    }).format(value);
}

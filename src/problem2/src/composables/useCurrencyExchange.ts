import type { Currency } from '@/types/Currency.ts';
import { useCurrencyStore } from '@/stores/currencyStore.ts';
import { MINIMUM_USD_VALUE, MAXIMUM_USD_VALUE } from '@/constants/limit.constant.ts';

const useCurrencyExchange = () => {
	const currencyStore = useCurrencyStore();
	const baseCurrencyExchange = currencyStore.availableCurrency?.find((currency) => currency.currency === 'USD') || { price: 1, currency: 'USD' };
	const basePrice = Number(baseCurrencyExchange.price);

	const calculateCurrencyPriceBaseOnUSD = ({ amount, price }: { amount: number; price: number }) => {
		return (amount * price) / basePrice;
	};

	const calculateMinInput = (price: number) => {
		return MINIMUM_USD_VALUE / price;
	};

	const calculateMaxInput = (price: number) => {
		return Math.floor(100 * (MAXIMUM_USD_VALUE / price)) / 100;
	};

	const calculateCurrencyPriceBaseOnSelected = (amount: number, from: Currency, to: Currency) => {
		return amount * (Number(from.price) / Number(to.price));
	};

	const handleQueryParamsOnCurrencyChange = () => {
		const url = new URL(window.location.href);
		url.searchParams.set('from', currencyStore.fromCurrency?.currency || '');
		url.searchParams.set('to', currencyStore.toCurrency?.currency || '');

		// Add query without reloading the page
		window.history.pushState({}, '', url);
	};

	const handleRevert = () => {
		const previousFromCurrency = currencyStore.fromCurrency;
		currencyStore.fromCurrency = currencyStore.toCurrency;
		currencyStore.toCurrency = previousFromCurrency;
		handleQueryParamsOnCurrencyChange();
	};

	return {
		handleRevert,
		calculateMinInput,
		calculateMaxInput,
		calculateCurrencyPriceBaseOnUSD,
		calculateCurrencyPriceBaseOnSelected,
		handleQueryParamsOnCurrencyChange,
	};
};

export default useCurrencyExchange;

import { defineStore } from 'pinia';
import { useCurrencyStore } from '@/stores/currencyStore.ts';
import { ref } from 'vue';

export const useApplicationStore = defineStore('application', () => {
	const currencyStore = useCurrencyStore();
	const isLoading = ref<Boolean>(false);
	const showCurrencyListModal = ref<'from' | 'to' | null>(null);
	const showPreviewModal = ref<{ fromAmount: number; toAmount: number } | null>(null);

	const init = async () => {
		isLoading.value = true;
		await currencyStore.fetchAvailableCurrency();
		await currencyStore.mapCurrencyThumbnail();
		const url = new URL(window.location.href);
		const fromCurrencyQuery = url.searchParams.get('from');
		const toCurrencyQuery = url.searchParams.get('to');
		if (!currencyStore.fromCurrency) {
			if (fromCurrencyQuery) {
				currencyStore.fromCurrency = currencyStore.availableCurrency?.find((currency) => currency.currency === fromCurrencyQuery) || null;
			} else currencyStore.fromCurrency = currencyStore.availableCurrency?.find((currency) => currency.currency === 'USD') || null;
		}
		if (!currencyStore.toCurrency) {
			if (toCurrencyQuery) {
				currencyStore.toCurrency = currencyStore.availableCurrency?.find((currency) => currency.currency === toCurrencyQuery) || null;
			} else currencyStore.toCurrency = currencyStore.availableCurrency?.find((currency) => currency.currency === 'ETH') || null;
		}

		isLoading.value = false;
	};

	return {
		isLoading,
		showCurrencyListModal,
		showPreviewModal,
		init,
	};
});

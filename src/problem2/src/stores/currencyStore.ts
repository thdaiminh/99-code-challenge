import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';
import type { Currency } from '@/types/Currency.ts';

export const useCurrencyStore = defineStore('currency', () => {
	const availableCurrency = ref<Currency[] | null>(null);
	const fromCurrency = ref<Currency | null>(null);
	const toCurrency = ref<Currency | null>(null);

	const fetchAvailableCurrency = async (): Promise<void> => {
		const response = await axios
			.get<Currency[]>('https://interview.switcheo.com/prices.json')
			.catch((err) => console.error('Error fetching currency', err));
		if (!response?.data) {
			return;
		}

		// Removing duplicated values, only newest data is kept
		const latestData: Currency[] = response.data.reduce<Currency[]>((acc, item) => {
			const existing = acc.find((entry) => entry.currency === item.currency);

			if (!existing || new Date(item.date) > new Date(existing.date)) {
				const index = acc.findIndex((entry) => entry.currency === item.currency);
				if (index !== -1) {
					acc.splice(index, 1);
				}
				acc.push(item);
			}

			return acc;
		}, []);

		availableCurrency.value = latestData;
	};

	const mapCurrencyThumbnail = (): void => {
		if (availableCurrency.value?.length === 0) return;

		availableCurrency.value?.forEach((currency) => {
			// Check if the currency is staked or not then map them with correct thumbnail
			const stakedRegex = /^(ST(?!RD)|R)/; //Exception for STRD
			const isStaked = stakedRegex.test(currency.currency);
			if (isStaked) {
				const match = currency.currency.match(stakedRegex);
				if (match) {
					const matchedText = match[0];
					const restOfString = currency.currency.slice(matchedText.length);
					const transformedMatch = matchedText.toLowerCase();
					currency.thumbnailUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${transformedMatch + restOfString}.svg`;
				}
			} else currency.thumbnailUrl = `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency.currency}.svg`;
		});
	};

	return {
		fromCurrency,
		toCurrency,
		availableCurrency,
		fetchAvailableCurrency,
		mapCurrencyThumbnail,
	};
});

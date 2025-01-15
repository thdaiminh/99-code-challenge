<template>
	<div class="backdrop currency-list-modal">
		<div class="modal-container">
			<div class="currency-list-modal__wrapper custom-scrollbar">
				<div class="modal-header">
					<div class="title flex justify-between align-center">
						<div class="typography-heading text-color-neutral-9 text-weight-700">Select Currency</div>
						<IconClose class="icon-close" :width="16" :height="16" fill="#15181e" @click="handleCloseModal" />
					</div>
					<div class="search-input">
						<input type="text" placeholder="Search" v-model="searchQuery" />
					</div>
				</div>
				<div class="modal-content">
					<div class="currency-list__wrapper">
						<div
							v-if="clonedCurrencyList && clonedCurrencyList.length > 0"
							class="currency-row"
							v-for="(currency, index) in clonedCurrencyList"
							:key="`${currency}-${index}`"
							@click="handleOnSelectCurrency(currency)"
						>
							<div class="flex align-center gap-8">
								<div class="currency-thumbnail">
									<img :src="currency.thumbnailUrl" :alt="`${currency.currency} thumbnail`" />
								</div>
								<div class="typography-subtitle1 text-weight-500 text-color-neutral-9 currency-name">
									{{ currency.currency }}
								</div>
							</div>
							<div
								class="selected-indicator"
								v-if="
									(isFromCurrencySelected && currency.currency === currencyStore.fromCurrency.currency) ||
									(!isFromCurrencySelected && currency.currency === currencyStore.toCurrency.currency)
								"
							>
								<IconCheck :width="16" :height="16" fill="#31d87a" />
							</div>
						</div>
						<div v-else class="not-found-text text-center">Currency not found, please try again with different keyword.</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useApplicationStore } from '@/stores/applicationStore.ts';
	import { useCurrencyStore } from '@/stores/currencyStore.ts';
	import IconClose from '@/components/icons/IconClose.vue';
	import { computed, onMounted, ref, watch } from 'vue';
	import IconCheck from '@/components/icons/IconCheck.vue';
	import type { Currency } from '@/types/Currency.ts';
	import useCurrencyExchange from '@/composables/useCurrencyExchange.ts';

	const applicationStore = useApplicationStore();
	const currencyStore = useCurrencyStore();
	const { handleQueryParamsOnCurrencyChange, handleRevert } = useCurrencyExchange();

	const searchQuery = ref<String>(null);
	const isFromCurrencySelected = computed(() => applicationStore.showCurrencyListModal === 'from');
	const clonedCurrencyList = ref<Currency[] | []>([]);

	watch(searchQuery, (value) => {
		clonedCurrencyList.value = currencyStore.availableCurrency.filter((currency) => currency.currency.toLowerCase().includes(value.toLowerCase()));
	});

	const handleCloseModal = () => {
		applicationStore.showCurrencyListModal = null;
	};

	const handleOnSelectCurrency = (value: Currency) => {
		if (isFromCurrencySelected.value) {
			if (value.currency === currencyStore.toCurrency.currency) {
				handleRevert();
			} else currencyStore.fromCurrency = value;
		} else {
			if (value.currency === currencyStore.fromCurrency.currency) {
				handleRevert();
			}
			currencyStore.toCurrency = value;
		}
		handleQueryParamsOnCurrencyChange();
		handleCloseModal();
	};

	onMounted(() => {
		clonedCurrencyList.value = currencyStore.availableCurrency;
	});
</script>

<style lang="scss" scoped>
	@use '@/assets/styles/colorsPalette' as *;
	.backdrop {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #00000080;
		backdrop-filter: blur(2px);
		z-index: 999;
	}

	.modal-container {
		position: relative;
		display: flex;
		justify-content: center;
		height: 100%;
		align-items: center;
		padding-block: 40px;
	}

	.currency-list-modal__wrapper {
		position: relative;
		align-self: center;
		background: $colorWhite;
		width: 500px;
		border-radius: 16px;

		max-height: 70vh;
		overflow: auto;
		.modal-header {
			position: sticky;
			top: 0;
			background: white;
			padding: 16px 24px;
			border-bottom: 1px solid $colorNeutral300;
			.icon-close {
				&:hover {
					cursor: pointer;
				}
			}
			.search-input {
				margin-top: 24px;
				height: 40px;
				border-radius: 8px;
				display: flex;
				> input {
					width: 100%;
					height: 100%;
					border: 0;
					text-align: left;
					font-size: 18px;
					line-height: 25px;
					outline: 1px solid $colorNeutral300;
					border-radius: 8px;
					padding-inline: 12px;
					&:hover {
						outline: 1px solid $colorNeutral500;
					}
					&:active,
					&:focus {
						outline: 1px solid $colorWarning500;
					}
				}
			}
		}

		.modal-content {
			padding-top: 16px;
			.currency-list__wrapper {
				display: flex;
				flex-flow: column;
			}
			.currency-row {
				display: flex;
				justify-content: space-between;
				background: $colorWhite;
				height: 44px;
				border-radius: 8px;
				align-items: center;
				padding-inline: 24px;
				.currency-thumbnail {
					width: 24px;
					height: 24px;
					> img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				.currency-name {
					font-size: 18px;
					margin-left: 8px;
				}
				&:hover {
					background: $colorNeutral200;
					cursor: pointer;
				}
			}
			.not-found-text {
				margin-bottom: 16px;
				padding-inline: 24px;
			}
		}
	}
</style>

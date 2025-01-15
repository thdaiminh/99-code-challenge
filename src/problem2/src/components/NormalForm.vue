<template>
	<div class="normal-form">
		<div class="form-wrapper">
			<div class="from-row form-row" :class="{ 'error-highlight': errorMsg.fromAmount }">
				<div class="flex justify-between gap-8">
					<div class="typography-subtitle1 text-color-neutral-5 text-weight-500">From</div>
					<div class="typography-subtitle1 text-color-neutral-7">Balance: Unlimited {{ currencyStore.fromCurrency.currency }}</div>
				</div>
				<div class="flex flex-column">
					<div class="input-section flex align-baseline justify-between gap-8">
						<div class="flex gap-8 coins-selectbox" @click="handleOpenCurrencyModalForFromInput">
							<img :src="currencyStore.fromCurrency.thumbnailUrl" :alt="`${currencyStore.fromCurrency.currency} thumbnail`" />
							<div class="typography-subtitle1 text-color-neutral-7 text-weight-500">{{ currencyStore.fromCurrency.currency }}</div>
							<IconCaretDown :width="10" :height="8" fill="#5e6a82" />
						</div>

						<div class="input-wrapper flex flex-column gap-4 text-right">
							<div class="amount-input transparent-input">
								<input
									type="number"
									min="0"
									:placeholder="fromPlaceHolderRange"
									v-model="inputFromCurrency"
									@blur="handleCalculateFromResult"
									@keydown.enter="handleCalculateFromResult"
									@input="
										debounce(() => {
											handleCalculateFromResult();
										}, 200)
									"
								/>
							</div>
							<div v-if="inputFromCurrency" class="typography-caption text-color-neutral-5">
								≈ ${{
									sanitizePrice(
										calculateCurrencyPriceBaseOnUSD({
											amount: inputFromCurrency,
											price: currencyStore.fromCurrency.price,
										}),
									)
								}}
							</div>
						</div>
					</div>
					<div v-if="errorMsg.fromAmount" class="error-message flex gap-8 justify-end">
						<div class="typography-caption text-color-danger-5 text-right">{{ errorMsg.fromAmount }}</div>
					</div>
				</div>
			</div>
			<div class="revert-btn" @click="handleRevertWithValue">
				<IconRevert :width="24" :height="24" fill="#d2d6e0" />
			</div>
			<div class="to-row form-row" :class="{ 'error-highlight': errorMsg.toAmount }">
				<div class="flex justify-between gap-8">
					<div class="typography-subtitle1 text-color-neutral-5 text-weight-500">To</div>
					<div class="typography-subtitle1 text-color-neutral-7">Balance: Unlimited {{ currencyStore.toCurrency.currency }}</div>
				</div>
				<div class="flex flex-column">
					<div class="input-section flex align-baseline justify-between gap-8">
						<div class="flex gap-8 coins-selectbox" @click="handleOpenCurrencyModalForToInput">
							<img :src="currencyStore.toCurrency.thumbnailUrl" :alt="`${currencyStore.toCurrency.currency} thumbnail`" />
							<div class="typography-subtitle1 text-color-neutral-7 text-weight-500">{{ currencyStore.toCurrency.currency }}</div>
							<IconCaretDown :width="10" :height="8" fill="#5e6a82" />
						</div>

						<div class="input-wrapper flex flex-column gap-4 text-right">
							<div class="amount-input transparent-input">
								<input
									type="number"
									min="0"
									:placeholder="toPlaceHolderRange"
									v-model="inputToCurrency"
									@blur="handleCalculateToResult"
									@keydown.enter="handleCalculateToResult"
									@input="
										debounce(() => {
											handleCalculateToResult();
										}, 200)
									"
								/>
							</div>
							<div v-if="inputToCurrency" class="typography-caption text-color-neutral-5">
								≈ ${{
									sanitizePrice(
										calculateCurrencyPriceBaseOnUSD({
											amount: inputToCurrency,
											price: currencyStore.toCurrency.price,
										}),
									)
								}}
							</div>
						</div>
					</div>
					<div v-if="errorMsg.toAmount" class="error-message flex gap-8 justify-end">
						<div class="typography-caption text-color-danger-5 text-right">{{ errorMsg.toAmount }}</div>
					</div>
				</div>
			</div>
		</div>

		<div class="preview-btn-wrapper">
			<button class="preview-btn" @click="handleOpenPreviewModal" :disabled="shouldDisablePreviewCta">
				<span class="preview-btn-text text-weight-600 text-color-neutral-9">
					{{ previewCtaText }}
				</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, ref, watch } from 'vue';
	import IconCaretDown from '@/components/icons/IconCaretDown.vue';
	import IconRevert from '@/components/icons/IconRevert.vue';

	import { useCurrencyStore } from '@/stores/currencyStore.ts';
	import { useApplicationStore } from '@/stores/applicationStore.ts';
	import useCurrencyExchange from '@/composables/useCurrencyExchange.ts';
	import { sanitizePrice } from '@/utils/pricing.ts';
	import useForm from '@/composables/useForm.ts';

	const currencyStore = useCurrencyStore();
	const applicationStore = useApplicationStore();
	const { handleRevert, calculateCurrencyPriceBaseOnUSD, calculateMinInput, calculateMaxInput, calculateCurrencyPriceBaseOnSelected } =
		useCurrencyExchange();

	const { debounce, validateFromCurrencyInput, validateToCurrencyInput, errorMsg } = useForm();

	const inputToCurrency = ref<Number>(null);
	const inputFromCurrency = ref<Number>(null);

	const shouldDisablePreviewCta = computed(() => {
		return Object.keys(errorMsg.value).length !== 0 || !inputToCurrency.value || !inputFromCurrency.value;
	});

	const fromMinInputAmount = computed(() => {
		return calculateMinInput(currencyStore.fromCurrency.price);
	});
	const fromMaxInputAmount = computed(() => {
		return calculateMaxInput(currencyStore.fromCurrency.price);
	});

	const toMinInputAmount = computed(() => {
		return calculateMinInput(currencyStore.toCurrency.price);
	});
	const toMaxInputAmount = computed(() => {
		return calculateMaxInput(currencyStore.toCurrency.price);
	});

	const previewCtaText = computed(() => {
		if (shouldDisablePreviewCta.value) {
			return `Enter amount`;
		}
		return 'Preview swap';
	});

	const fromPlaceHolderRange = computed(() => {
		return `${fromMinInputAmount.value.toFixed(5).toLocaleString('en-US', { maximumFractionDigits: 3 })} - ${fromMaxInputAmount.value.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
	});

	const toPlaceHolderRange = computed(() => {
		return `${toMinInputAmount.value.toFixed(5).toLocaleString('en-US', { maximumFractionDigits: 3 })} - ${toMaxInputAmount.value.toFixed(2).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
	});

	watch(
		() => currencyStore.fromCurrency,
		(value) => {
			if (value && inputFromCurrency.value) {
				handleCalculateFromResult();
			}
		},
		{ deep: true },
	);

	watch(
		() => currencyStore.toCurrency,
		(value) => {
			if (value && inputToCurrency.value) {
				handleCalculateToResult();
			}
		},
		{ deep: true },
	);

	watch(inputFromCurrency, (value) => {
		if (value && inputFromCurrency.value) {
			validateToCurrencyInput(inputFromCurrency.value, {
				min: fromMinInputAmount.value,
				max: fromMaxInputAmount.value,
				currency: currencyStore.fromCurrency.currency,
			});
		}
	});

	watch(inputToCurrency, (value) => {
		if (value && inputToCurrency.value) {
			validateToCurrencyInput(inputToCurrency.value, {
				min: toMinInputAmount.value,
				max: toMaxInputAmount.value,
				currency: currencyStore.toCurrency.currency,
			});
		}
	});

	const handleRevertWithValue = () => {
		handleRevert();
		inputFromCurrency.value = inputToCurrency.value;
		// Swap error indicator
		const previousErrorMsg = JSON.parse(JSON.stringify(errorMsg.value));
		errorMsg.value.fromAmount = previousErrorMsg.toAmount;
		errorMsg.value.toAmount = previousErrorMsg.fromAmount;
	};

	const handleOpenCurrencyModalForFromInput = () => {
		applicationStore.showCurrencyListModal = 'from';
	};

	const handleOpenCurrencyModalForToInput = () => {
		applicationStore.showCurrencyListModal = 'to';
	};

	const handleCalculateFromResult = () => {
		if (inputFromCurrency.value === undefined || inputFromCurrency.value === null) {
			return;
		}
		const result = calculateCurrencyPriceBaseOnSelected(inputFromCurrency.value, currencyStore.fromCurrency, currencyStore.toCurrency);
		inputToCurrency.value = result;
		validateFromCurrencyInput(inputFromCurrency.value, {
			min: fromMinInputAmount.value,
			max: fromMaxInputAmount.value,
			currency: currencyStore.fromCurrency.currency,
		});
	};

	const handleCalculateToResult = () => {
		if (inputToCurrency.value === undefined || inputToCurrency.value === null) {
			return;
		}
		const result = calculateCurrencyPriceBaseOnSelected(inputToCurrency.value, currencyStore.toCurrency, currencyStore.fromCurrency);
		inputFromCurrency.value = result;
		validateToCurrencyInput(inputToCurrency.value, {
			min: toMinInputAmount.value,
			max: toMaxInputAmount.value,
			currency: currencyStore.toCurrency.currency,
		});
	};

	const handleOpenPreviewModal = () => {
		applicationStore.showPreviewModal = { fromAmount: inputFromCurrency.value, toAmount: inputToCurrency.value };
	};
</script>

<style lang="scss" scoped>
	@use '@/assets/styles/colorsPalette' as *;
	@use '@/assets/styles/mixins' as *;

	.normal-form {
		width: 500px;

		.form-wrapper {
			display: flex;
			flex-flow: column;
			gap: 16px;
			position: relative;
			width: 100%;
		}
		.form-row {
			height: 130px;
			border-radius: 12px;
			padding: 16px;
			display: flex;
			flex-flow: column;
			gap: 16px;
			border: 1px solid $colorNeutral100;
			&:hover {
				border: 1px solid $colorNeutral500;
			}
		}
		.error-highlight {
			border: 1px solid $colorDanger500 !important;
		}
		.coins-selectbox {
			border-radius: 6px;
			padding: 6px;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				width: 24px;
				height: 24px;
			}
			&:hover {
				background: $colorNeutral100;
				cursor: pointer;
			}
		}
		.error-message {
			margin-top: 16px;
		}
		.revert-btn {
			position: absolute;
			border-radius: 12px;
			border: 1px solid $colorNeutral100;
			z-index: 1;
			width: 42px;
			height: 42px;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 50%;
			top: 50%;
			background: $colorWhite;
			transform: translate(-50%, -50%);
			transition: 0.2s ease-in-out;
			svg {
				transition: 0.2s ease-in-out;
			}
			&:hover {
				border: 1px solid $colorNeutral500;
				cursor: pointer;
				svg {
					fill: $colorNeutral700;
				}
			}
		}

		.preview-btn-wrapper {
			width: 100%;
			height: 44px;
			margin-top: 32px;
			.preview-btn-text {
				font-size: 16px;
				line-height: 24px;
				font-family: 'Sen', sans-serif;
			}
			.preview-btn {
				width: 100%;
				height: 100%;
				border-radius: 12px;
				overflow: hidden;
				transition: 0.2s ease-in-out;
				border: 0;
				background: $colorWarning500;
				&:hover {
					cursor: pointer;
					background: $colorWarning600;
				}
				&:disabled {
					cursor: not-allowed;
				}
			}
		}
	}

	@include mobile {
		.normal-form {
			width: 100%;
			.form-row {
				height: 180px;
				.input-section {
					flex-flow: column;
					.input-wrapper {
						text-align: left !important;
						input {
							text-align: left !important;
						}
					}
				}
			}
			.error-message {
				> div {
					text-align: center;
				}
			}
		}
	}
</style>

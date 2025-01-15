<template>
	<div class="backdrop preview-modal">
		<div class="modal-container">
			<div class="preview-modal__wrapper">
				<div class="modal-header">
					<div class="title flex justify-between align-center">
						<div class="typography-heading text-color-neutral-9 text-weight-700">Preview</div>
						<IconClose class="icon-close" :width="16" :height="16" fill="#15181e" @click="handleCloseModal" />
					</div>
				</div>
				<div class="modal-content">
					<div class="main-content">
						<div v-if="!isSubmitted" class="summarize-section flex gap-16 justify-evenly">
							<div class="from-currency currency-row">
								<img :src="currencyStore.fromCurrency.thumbnailUrl" />
								<div class="typography-subtitle1 text-color-neutral-5 text-weight-500">From</div>
								<div class="amount">{{ applicationStore.showPreviewModal.fromAmount }} {{ currencyStore.fromCurrency.currency }}</div>
							</div>
							<div class="arrow-icon flex justify-center align-center">
								<IconArrowLargeDown />
							</div>
							<div class="to-currency currency-row">
								<img :src="currencyStore.toCurrency.thumbnailUrl" />
								<div class="typography-subtitle1 text-color-neutral-5 text-weight-500">To</div>
								<div class="amount">{{ applicationStore.showPreviewModal.toAmount }} {{ currencyStore.toCurrency.currency }}</div>
							</div>
						</div>
						<div v-else class="flex flex-column align-center justify-center gap-16">
							<div class="success-icon">
								<IconCircleCheck :width="40" :height="40" fill="#14bb5d" />
							</div>
							<div class="text-center typography-heading text-weight-500">Swap transaction succeed</div>
						</div>
					</div>

					<div class="btn-wrapper">
						<button v-if="!isSubmitted" class="submit-btn" @click="handleSubmit">
							<div v-if="isSubmitting" class="loading-icon">
								<IconLoader />
							</div>
							<span v-else class="submit-btn-text text-weight-600 text-color-neutral-9"> Swap </span>
						</button>
						<button v-else class="submit-btn" @click="handleCloseModal">
							<span class="submit-btn-text text-weight-600 text-color-neutral-9"> Okay </span>
						</button>
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
	import { ref } from 'vue';
	import IconArrowLargeDown from '@/components/icons/IconArrowLargeDown.vue';
	import IconLoader from '@/components/icons/IconLoader.vue';
	import IconCircleCheck from '@/components/icons/IconCircleCheck.vue';

	const applicationStore = useApplicationStore();
	const currencyStore = useCurrencyStore();

	const isSubmitting = ref<Boolean>(false);
	const isSubmitted = ref<Boolean>(false);

	const handleCloseModal = () => {
		applicationStore.showPreviewModal = null;
	};

	const delay = (time) => {
		return new Promise((resolve) => setTimeout(resolve, time));
	};

	const handleSubmit = async () => {
		isSubmitting.value = true;
		await delay(1400);
		isSubmitting.value = false;
		isSubmitted.value = true;
	};
</script>

<style lang="scss" scoped>
	@use '@/assets/styles/colorsPalette' as *;
	@use '@/assets/styles/mixins' as *;

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

	.preview-modal__wrapper {
		position: relative;
		align-self: center;
		background: $colorWhite;
		width: 600px;
		border-radius: 16px;

		max-height: 70vh;
		overflow: auto;
		.modal-header {
			padding: 16px 24px;
			.icon-close {
				&:hover {
					cursor: pointer;
				}
			}
		}

		.modal-content {
			padding: 16px 24px;
			.summarize-section {
				.arrow-icon {
					transform: rotate(-90deg);
				}
			}
			.currency-row {
				display: flex;
				flex-flow: column;
				gap: 8px;
				align-items: center;
				img {
					width: 40px;
					height: 40px;
				}
				.amount {
					font-size: 18px;
					font-weight: 600;
				}
			}
			.btn-wrapper {
				width: 100%;
				height: 44px;
				margin-top: 32px;
				.submit-btn-text {
					font-size: 16px;
					line-height: 24px;
					font-family: 'Sen', sans-serif;
				}
				.submit-btn {
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
				}
			}
		}
	}

	@include mobile {
		.preview-modal__wrapper {
			width: 100%;
			.modal-content {
				.summarize-section {
					flex-flow: column;
					.arrow-icon {
						transform: rotate(0deg);
					}
				}
			}
		}
	}
</style>

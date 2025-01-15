import { ref } from 'vue';

const useForm = () => {
	const errorMsg = ref<any>({});

	const inputDebounce = () => {
		let timeout: any = null;
		return function (fnc: Function, delayMs: number) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				fnc();
			}, delayMs || 500);
		};
	};

	const updateError = (key: string, isValid: boolean, message?: string) => {
		const errors = errorMsg.value;
		if (isValid) {
			const currentErrors = { ...errors };
			delete currentErrors[key];
			errorMsg.value = currentErrors;
		} else {
			errorMsg.value = {
				...errors,
				[key]: message,
			};
		}
	};

	const validateFromCurrencyInput = (amount: number, minMaxAmount: { min: number; max: number; currency: string }) => {
		if (amount < Number(minMaxAmount.min.toFixed(5))) {
			updateError('fromAmount', false, `Amount is less than the minimum amount (${minMaxAmount.min.toFixed(5)} ${minMaxAmount.currency}).`);
		} else if (amount > Number(minMaxAmount.max.toFixed(5))) {
			updateError('fromAmount', false, `Amount is more than the maximum amount (${minMaxAmount.max.toFixed(5)} ${minMaxAmount.currency}).`);
		} else {
			updateError('fromAmount', true);
		}
	};

	const validateToCurrencyInput = (amount: number, minMaxAmount: { min: number; max: number; currency: string }) => {
		if (amount < Number(minMaxAmount.min.toFixed(5))) {
			updateError('toAmount', false, `Amount is less than the minimum amount (${minMaxAmount.min.toFixed(5)} ${minMaxAmount.currency}).`);
		} else if (amount > Number(minMaxAmount.max.toFixed(5))) {
			updateError('toAmount', false, `Amount is more than the maximum amount (${minMaxAmount.max.toFixed(5)} ${minMaxAmount.currency}).`);
		} else {
			updateError('toAmount', true);
		}
	};

	return {
		updateError,
		errorMsg,
		validateFromCurrencyInput,
		validateToCurrencyInput,
		debounce: inputDebounce(),
	};
};

export default useForm;

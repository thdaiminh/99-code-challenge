export function sanitizePrice(rawPrice: number) {
	if (rawPrice % 1 == 0) {
		return rawPrice.toLocaleString('en-US');
	} else {
		return Number(rawPrice.toFixed(99)).toLocaleString('en-US', { maximumFractionDigits: 99 });
	}
}

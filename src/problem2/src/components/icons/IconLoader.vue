<template>
	<svg :width="size" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M20 5.71428C12.1102 5.71428 5.71428 12.1102 5.71428 20C5.71428 27.8898 12.1102 34.2857 20 34.2857C27.8898 34.2857 34.2857 27.8898 34.2857 20C34.2857 12.1102 27.8898 5.71428 20 5.71428ZM0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20Z"
			fill="#E2E5E7"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M17.1431 37.1429C17.1431 35.5649 18.4223 34.2857 20.0002 34.2857C27.89 34.2857 34.2859 27.8898 34.2859 20C34.2859 12.1102 27.89 5.7143 20.0002 5.7143C18.4223 5.7143 17.1431 4.43512 17.1431 2.85716C17.1431 1.27921 18.4223 1.90176e-05 20.0002 1.89486e-05C31.0459 1.84658e-05 40.0002 8.95432 40.0002 20C40.0002 31.0457 31.0459 40 20.0002 40C18.4223 40 17.1431 38.7208 17.1431 37.1429Z"
			:fill="fill"
		/>
		<defs>
			<linearGradient id="paint0_linear" x1="7.73132" y1="54.7826" x2="10.3548" y2="-9.71287" gradientUnits="userSpaceOnUse">
				<stop stop-color="#0B97ED" />
				<stop offset="1" stop-color="#FC293F" />
			</linearGradient>
		</defs>
	</svg>
</template>

<script setup lang="ts">
	defineProps({
		size: { type: Number, default: 24 },
		fill: { type: String, default: '#5e6a82' },
	});
</script>

<style lang="scss" scoped>
	@keyframes rotate {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}
	svg {
		animation: 0.6s linear infinite rotate;
	}
</style>

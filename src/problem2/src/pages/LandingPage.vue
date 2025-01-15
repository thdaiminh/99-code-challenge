<template>
	<div class="landing-page">
		<div class="title typography-heading text-weight-700">Currency Swapper Form</div>
		<NormalForm />
	</div>
</template>

<script setup lang="ts">
	import NormalForm from '@/components/NormalForm.vue';
</script>

<style lang="scss" scoped>
	@use '@/assets/styles/mixins' as *;

	.landing-page {
		display: flex;
		flex-flow: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		min-height: 100vh;
		overflow: hidden;

		.title {
			margin-bottom: 32px;
		}
	}

	@include mobile {
		.landing-page {
			padding: 16px;
		}
	}
</style>

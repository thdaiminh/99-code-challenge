<template>
	<div class="global-modals">
		<CurrencyListModal v-if="applicationStore.showCurrencyListModal" />
		<PreviewModal v-if="applicationStore.showPreviewModal" />
	</div>
</template>

<script setup lang="ts">
	import { useApplicationStore } from '@/stores/applicationStore.ts';
	import CurrencyListModal from '@/components/CurrencyListModal.vue';
	import PreviewModal from '@/components/PreviewModal.vue';

	const applicationStore = useApplicationStore();
</script>

<style lang="scss" scoped></style>

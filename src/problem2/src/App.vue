<template>
	<div id="app">
		<LoadingPage v-if="applicationStore.isLoading" />
		<LandingPage v-else />
		<GlobalModals />
	</div>
</template>

<script setup lang="ts">
	import LandingPage from '@/pages/LandingPage.vue';
	import { useApplicationStore } from '@/stores/applicationStore.ts';
	import LoadingPage from '@/pages/LoadingPage.vue';
	import GlobalModals from '@/components/GlobalModals.vue';

	const applicationStore = useApplicationStore();
	applicationStore.init();
</script>

<style lang="scss" scoped>
	#app {
		min-width: 100vw;
		min-height: 100vh;
	}
</style>

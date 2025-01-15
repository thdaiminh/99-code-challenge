<template>
	<div class="loading-page">
		<IconLoader />
	</div>
</template>

<script setup lang="ts">
	import IconLoader from '@/components/icons/IconLoader.vue';
</script>

<style lang="scss" scoped>
	.loading-page {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		min-height: 100vh;
	}
</style>

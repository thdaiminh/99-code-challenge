<template>
	<svg :width="width" :height="height" :fill="fill" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path d="M7.5 3h3v18.5l-7-7h4V3zM16.5 21h-3V2.5l7 7h-4V21z"></path>
	</svg>
</template>

<script setup lang="ts">
	defineProps({
		width: { type: Number, default: 24 },
		height: { type: Number, default: 24 },
		fill: { type: String, default: '#5e6a82' },
	});
</script>

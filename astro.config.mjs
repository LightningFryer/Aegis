import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    security: {
		checkOrigin: true
	},
	output: "hybrid"
});

import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const config = {
	preprocess: [
		vitePreprocess({
			script: true
		})
	],
	kit: {
		adapter: adapter()
	}
}

export default config

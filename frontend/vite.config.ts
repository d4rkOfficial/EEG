import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	ssr: {
		noExternal: [
			'echarts',
			'echarts-gl'
			// "qrcode"
		]
	},
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3000
	},
	build: {
		target: 'esnext'
	}
})

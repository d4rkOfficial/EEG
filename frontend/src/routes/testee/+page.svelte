<script lang="ts">
	import Chart from '$lib/components/custom/chart/chart.svelte'
	import { handshake } from '$lib/utils/handshake'
	import { onMount } from 'svelte'
	import type { Packet } from '$lib/types/packet'

	const seriesNames = ['专注度', '放松度']
	const seriesColors = ['#2196F3', '#F44336']

	let ws: WebSocket
	let chart = $state<Chart>()
	let deviceId = $state(0)
	let hidden = $state(false)

	onMount(async () => {
		deviceId = parseInt(location.hash.split('#')[1])
		ws = new WebSocket(`ws://${location.hostname}:8080`)
		handshake(ws, deviceId, 'testee')
		ws.addEventListener('message', (event) => {
			const p = JSON.parse(event.data) as Packet
			if (!chart) {
				return
			}
			chart.appendData(p.timestamp, p.attention, p.meditation)
		})
	})
</script>

<button
	class="flex h-screen w-screen items-center justify-center bg-white text-4xl text-black"
	{hidden}
	onclick={() => {
		hidden = true
		const docEl = document.documentElement
		const requestFullscreen = // @ts-ignore
			docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen
		if (!requestFullscreen) {
			return
		}
		requestFullscreen.call(docEl)
	}}
>
	<div class="text-center">
		<h1 class="font-bold text-gray-800 dark:text-gray-800">
			<div class="mb-3 text-6xl">欢迎您</div>
			<div class="text-5xl text-cyan-600">参与本次测试</div>
		</h1>
		<p class="mt-40 text-2xl text-gray-600 dark:text-gray-600">点击任意处继续</p>
	</div>
</button>

<Chart class="h-screen w-screen" bind:this={chart} {seriesNames} {seriesColors}></Chart>

<script lang="ts">
    import { onMount } from 'svelte'
    import { sleep } from '$lib/utils/sleep'

    let { slogans = ['Hello, world!'], ...restProps } = $props()
    let slogan = $state('')

    const type = async (text: string) => {
        slogan = ''

        for (let i = 0; i < text.length; i++) {
            slogan = text.slice(0, i + 1)
            await sleep(1000 / text.length)
        }

        await sleep(text.length * 100)
    }

    onMount(async () => {
        while (true) {
            for (const s of slogans) {
                await type(s)
            }
        }
    })
</script>

<h1 {...restProps}>
    <span>{slogan}</span>
    <span class="_cursor inline-block w-[1ch]">|</span>
</h1>

<style>
    ._cursor {
        animation: blink 1s infinite steps(2, start);
    }
    @keyframes blink {
        0% {
            opacity: 1;
        }
        49% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        99% {
            opacity: 0;
        }
    }
</style>

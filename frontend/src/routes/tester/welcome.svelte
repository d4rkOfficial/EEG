<script lang="ts">
    import { Slogan } from '$lib/components/custom'
    import Card from '$lib/components/ui/card/card.svelte'
    import { TEXTS } from '$lib/consts/texts'

    const slogans = TEXTS.SLOGANS
</script>

{#snippet StepCard(step: string, description: string)}
    <Card class="flex flex-1 gap-2 mask-t-from-50%">
        <div class="flex-12"></div>
        <div class="pl-5 text-2xl font-black text-gray-800">第{step}步</div>
        <div class="flex-1 px-5 text-lg text-gray-600">{description}</div>
    </Card>
{/snippet}

<div class="flex h-screen flex-col p-16">
    <h1 class="w-full text-6xl font-black text-gray-700">{TEXTS.TITLE}</h1>
    <Slogan class="mt-2 pr-6 text-4xl text-gray-700 opacity-85" {slogans} />

    <div class="mt-8 flex flex-4 gap-4"></div>
    <div class="mt-8 flex flex-3 gap-4">
        {@render StepCard('１', TEXTS.STEPS[0])}
        {@render StepCard('２', TEXTS.STEPS[1])}
        {@render StepCard('３', TEXTS.STEPS[2])}
    </div>
</div>

<div
    class="pointer-events-none absolute top-0 right-0 -z-50 h-screen w-200 bg-transparent select-none"
>
    <svg viewBox="0 0 256 256" class="object-right-center h-full w-full object-contain">
        <!-- 光场 -->
        <radialGradient id="halo" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="#7EE8FF" stop-opacity="0">
                <animate
                    attributeName="stop-opacity"
                    values="0.25;0.45;0.25"
                    dur="6s"
                    repeatCount="indefinite"
                />
            </stop>
            <stop offset="100%" stop-color="#7EE8FF" stop-opacity="0" />
        </radialGradient>
        <circle cx="128" cy="120" r="160" fill="url(#halo)" />

        <!-- 脑结构（增强线条版） -->
        <g stroke-linecap="round" stroke-linejoin="round" fill="none">
            <!-- 外层 -->
            <path
                d="M92 68 C65 92, 65 150, 92 172
             C92 203, 130 203, 130 172
             C160 170, 192 150, 182 118
             C215 95, 195 58, 160 70
             C150 38, 120 38, 110 70 Z"
                stroke="rgba(190,240,255,0.60)"
                stroke-width="6"
            />

            <!-- 内层神经束 -->
            <path
                d="M105 85 C90 110, 95 140, 115 158"
                stroke="rgba(190,240,255,0.45)"
                stroke-width="4"
            />
            <path
                d="M140 80 C155 102, 160 135, 140 160"
                stroke="rgba(190,240,255,0.45)"
                stroke-width="4"
            />
            <path
                d="M105 115 C130 130, 150 120, 170 135"
                stroke="rgba(190,240,255,0.38)"
                stroke-width="3"
            />
        </g>

        <!-- EEG 主波形 -->
        <linearGradient id="eegGrad" x1="0" x2="1">
            <stop offset="0%" stop-color="#7DF9FF" />
            <stop offset="60%" stop-color="#00D4FF" />
            <stop offset="100%" stop-color="#8F7CFF" />
        </linearGradient>
        <polyline
            id="eegWave"
            points="40,150 80,150 95,110 115,195 140,85 165,160 190,140 220,150"
            fill="none"
            stroke="url(#eegGrad)"
            stroke-width="9"
            stroke-linecap="round"
            stroke-linejoin="round"
        />

        <style>
            #eegWave {
                stroke-dasharray: 45 28;
                animation: flow 3.6s linear infinite;
            }
            @keyframes flow {
                from {
                    stroke-dashoffset: 120;
                }
                to {
                    stroke-dashoffset: -120;
                }
            }
            svg,
            .brain-bg,
            .absolute {
                overflow: visible !important;
            }
        </style>
    </svg>
</div>

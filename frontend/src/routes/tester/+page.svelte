<script lang="ts">
    import * as ButtonGroup from '$lib/components/ui/button-group'
    import Card from '$lib/components/ui/card/card.svelte'
    import Welcome from './welcome.svelte'
    import favicon from '$lib/assets/favicon.svg'
    import { Button } from '$lib/components/ui/button'
    import { Chart } from '$lib/components/custom'
    import type { Packet } from '$lib/types/packet'
    import { TEXTS } from '$lib/consts/texts'
    import { flip } from 'svelte/animate'
    import { handshake } from '$lib/utils/handshake'
    import { onMount } from 'svelte'
    import { scrollToElement } from '$lib/utils/scroll-to-element'
    import { serialLoop } from '$lib/utils/serial'
    import * as HoverCard from '$lib/components/ui/hover-card'

    const serisNames = [
        'Alpha高',
        'Alpha低',
        'Beta高',
        'Beta低',
        'Gamma高',
        'Gamma低',
        'Theta',
        '专注度',
        '放松度'
    ]

    interface EegDevice {
        deviceId: number
        chart: Chart | null
        ws: WebSocket | null
        disconnect: Function | null
        signal: string | number
    }

    const eegDevices = $state<EegDevice[]>([
        // { deviceId: 1 },
        // { deviceId: 2 },
        // { deviceId: 3 },
        // { deviceId: 4 },
        // { deviceId: 5 },
        // { deviceId: 6 },
        // { deviceId: 7 },
        // { deviceId: 8 },
        // { deviceId: 9 }
    ])

    let hash = $state('#localhost')
    let ip = $derived(hash.split('#')[1])
    let qrcode = $state<{ toString(...args: any[]): Promise<any> }>()!

    onMount(async () => {
        hash = location.hash
        qrcode = await import('qrcode')
    })

    let enableUploading = $state(false)

    const setupDeviceWsConnection = (device: EegDevice) => {
        device.ws = new WebSocket(`ws://${ip}:8080`)

        device.ws.addEventListener('message', (event) => {
            const p = JSON.parse(event.data) as Packet
            if (!device.chart) {
                return
            }
            device.signal = p.signal
            device.chart.appendData(
                p.timestamp,
                p.highAlpha,
                p.lowAlpha,
                p.highBeta,
                p.lowBeta,
                p.middleGamma,
                p.lowGamma,
                p.theta,
                p.attention,
                p.meditation
            )
        })

        return handshake(device.ws, device.deviceId, 'tester')
    }

    const connectSerial = (device: EegDevice) => {
        const loop = serialLoop((data) => {
            if (!enableUploading) {
                return
            }
            device.ws!.send(data)
        })
        device.disconnect = loop.close
        return loop
    }

    const addAndConnectDevice = async () => {
        const input = prompt(TEXTS.INPUT_DEVICE_ID)
        if (input === null) {
            return
        }

        const id = parseInt(input)
        if (!id || isNaN(id)) {
            alert(TEXTS.INVALID_DEVICE_ID)
            return
        }
        if (eegDevices.find((d) => d.deviceId === id)) {
            alert(TEXTS.DEVICE_ID_EXISTS)
            return
        }

        const newDevice = $state<EegDevice>({
            deviceId: id,
            chart: null,
            ws: null,
            disconnect: null,
            signal: TEXTS.NO_SIGNAL
        })

        const loop = connectSerial(newDevice)
        await setupDeviceWsConnection(newDevice)
        loop.start()

        if (!(await loop.started)) {
            alert(TEXTS.FAIL_TO_CONNECT_SERIAL)
            return
        }

        eegDevices.push(newDevice)
        eegDevices.sort((d1, d2) => d1.deviceId - d2.deviceId)
    }
</script>

{#snippet Graph(device: EegDevice)}
    <Card
        id={'device-' + device.deviceId}
        class="mx-4 mt-0 mb-4 h-screen rounded-lg bg-white p-4 shadow-sm"
        ><div class="mb-4 flex mask-b-from-50% p-2 text-2xl font-bold text-gray-800">
            <div class="flex-1">
                {TEXTS.DEVICE}
                {device.deviceId}
            </div>
            <div>
                {#await typeof qrcode !== 'undefined' ? qrcode.toString(`http://${ip}:3000/testee#${device.deviceId}`): '' then image}
                <HoverCard.Root>
                    <HoverCard.Trigger>
                        <button
                            class="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-400 scale-150"
                            onclick={() => {
                                device.chart?.shiftData()
                            }}
                        >{@html image}</button>
                    </HoverCard.Trigger>
                    <HoverCard.Content>
                        {@html image}
                    </HoverCard.Content>
                </HoverCard.Root>
                {/await}
            </div>
        </div>
        <Chart seriesNames={serisNames} bind:this={device.chart} class="h-full w-full" />
    </Card>
{/snippet}

{#snippet SidebarListItem(device: EegDevice)}
    <Button
        id={'device-list-item-' + device.deviceId}
        class="flex h-16 w-full cursor-pointer items-center justify-between rounded-sm bg-gray-50 transition-colors hover:bg-gray-200"
        onclick={() => {
            scrollToElement(`device-${device.deviceId}`, 'center')
            scrollToElement(`device-list-item-${device.deviceId - 2}`, 'center')
        }}
        ><div class="flex-1 text-gray-700 hover:text-gray-900">
            <div class="flex items-center gap-2">
                <div class="flex-1 pl-2 text-left text-lg font-black">
                    {TEXTS.DEVICE}
                    {device.deviceId}
                </div>
                <div>{device.signal}</div>
            </div>
        </div>
    </Button>
{/snippet}

{#snippet ToolBar()}
    <div class="flex w-full flex-col gap-3 border-t border-gray-200 px-5 pt-5">
        <ButtonGroup.Root class="flex w-full">
            <Button
                class="h-11 flex-1 cursor-pointer bg-gray-200 py-3 font-black text-gray-900 transition-all duration-150 hover:scale-99 hover:bg-gray-300"
                onclick={() => {
                    eegDevices.forEach((d) => {
                        d.chart?.toggleSeriesVisibility([serisNames[0], serisNames[1]])
                    })
                }}
                >α
            </Button>
            <ButtonGroup.Separator class="bg-white" />
            <Button
                class="h-11 flex-1 cursor-pointer bg-gray-200 py-3 font-black text-gray-900 transition-all duration-150 hover:scale-99 hover:bg-gray-300"
                onclick={() => {
                    eegDevices.forEach((d) => {
                        d.chart?.toggleSeriesVisibility([serisNames[2], serisNames[3]])
                    })
                }}
                >β
            </Button>
            <ButtonGroup.Separator class="bg-white" />
            <Button
                class="h-11 flex-1 cursor-pointer bg-gray-200 py-3 font-black text-gray-900 transition-all duration-150 hover:scale-99 hover:bg-gray-300"
                onclick={() => {
                    eegDevices.forEach((d) => {
                        d.chart?.toggleSeriesVisibility([serisNames[4], serisNames[5]])
                    })
                }}
                >γ
            </Button>
            <ButtonGroup.Separator class="bg-white" />
            <Button
                class="h-11 flex-1 cursor-pointer bg-gray-200 py-3 font-black text-gray-900 transition-all duration-150 hover:scale-99 hover:bg-gray-300"
                onclick={() => {
                    eegDevices.forEach((d) => {
                        d.chart?.toggleSeriesVisibility([serisNames[6]])
                    })
                }}
                >θ
            </Button>
            <ButtonGroup.Separator class="bg-white" />
            <Button
                class="h-11 flex-1 cursor-pointer bg-gray-200 py-3 font-black text-gray-900 transition-all duration-150 hover:scale-99 hover:bg-gray-300"
                onclick={() => {
                    eegDevices.forEach((d) => {
                        d.chart?.toggleSeriesVisibility([serisNames[7], serisNames[8]])
                    })
                }}
                >专/放
            </Button>
        </ButtonGroup.Root>
        <Button
            disabled={enableUploading}
            class="w-full flex-1 cursor-pointer bg-sky-500 py-3 font-black text-gray-100 transition-all duration-150 hover:scale-99 hover:bg-sky-600"
            onclick={addAndConnectDevice}
        >
            {TEXTS.CONNECT_DEVICE}
        </Button>
        <Button
            class={`w-full flex-1 cursor-pointer py-3 font-black text-gray-100 transition-all duration-150 hover:scale-99 ${
                enableUploading ? 'bg-red-400 hover:bg-red-500' : 'bg-lime-600 hover:bg-lime-700'
            }`}
            onclick={() => {
                enableUploading = !enableUploading
            }}
        >
            {enableUploading ? TEXTS.PAUSE_DATA_STREAM : TEXTS.LETGO_DATA_STREAM}
        </Button>
    </div>
{/snippet}

<main class="flex">
    <!-- sidebar -->
    <Card class="flex h-screen w-70 gap-8 rounded-l-none">
        <div class="flex items-center gap-4">
            <img src={favicon} alt="" class="ml-8 h-8 w-8 mask-b-from-70%" />
            <span class="flex-1 mask-b-from-70% text-2xl font-black text-gray-700"
                >{TEXTS.DEVICE_LIST}</span
            >
        </div>
        <div
            class="flex flex-1 flex-col gap-4 overflow-y-auto mask-t-from-90% mask-b-from-90% pt-4"
        >
            {#each eegDevices as device (device.deviceId)}
                <div animate:flip class="mx-4">
                    {@render SidebarListItem(device)}
                </div>
            {:else}
                <div class="text-center text-gray-500 py-4">{TEXTS.CURRENTLY_NO_DEVICE}</div>
            {/each}
        </div>
        {@render ToolBar()}
    </Card>
    <!-- charts -->
    <div class="max-h-screen flex-1 overflow-y-scroll">
        {#each eegDevices as device (device.deviceId)}
            {@render Graph(device)}
        {:else}
            <Welcome />
        {/each}
    </div>
</main>

<script lang="ts">
    import * as echarts from 'echarts'
    import { onMount, onDestroy } from 'svelte'

    let {
        seriesNames = ['Series 1', 'Series 2'],
        seriesColors = [
            '#FF3B30',
            '#E53935',
            '#34C759',
            '#2E7D32',
            '#007AFF',
            '#1565C0',
            '#262626',
            '#FFCC00',
            '#AF52DE'
        ],
        maxLength = 200,
        options = {},
        ...restProps
    } = $props()

    let chartDom!: HTMLDivElement
    let chart!: echarts.ECharts

    const seriesCount = seriesNames.length
    const seriesData: Array<[number, number][]> = Array.from({ length: seriesCount }, () => [])
    const buffer: { timestamp: number; values: number[] }[] = []

    const makeOption = (): echarts.EChartsOption => ({
        color: seriesColors,
        title: { show: false },
        legend: {
            itemGap: 30,
            bottom: 25,
            selected: Object.fromEntries(seriesNames.map((name) => [name, true]))
        },
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'time',
            minInterval: 60 * 1000,
            axisLabel: {
                formatter: (value: number) => {
                    const date = new Date(value)
                    return `${String(date.getHours()).padStart(2, '0')}:${String(
                        date.getMinutes()
                    ).padStart(2, '0')}`
                }
            }
        },
        yAxis: { type: 'value', scale: true },
        series: seriesData.map((data, i) => ({
            type: 'line',
            name: seriesNames[i],
            data,
            showSymbol: false,
            smooth: true,
            lineStyle: { width: 1 },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        {
                            offset: 0,
                            color: seriesColors[i]
                        },
                        {
                            offset: 1,
                            color: 'rgba(255, 255, 255, 0)'
                        }
                    ]
                }
            }
        })),
        grid: {
            left: 10,
            right: 10,
            top: 20,
            bottom: 100
        },
        animation: true,
        ...options
        // animationDurationUpdate: 5
    })

    const initChart = () => {
        chart = echarts.init(chartDom)
        chart.setOption(makeOption(), { notMerge: false })

        buffer.forEach((data) => pushData(data.timestamp, data.values))
        buffer.length = 0
    }

    const pushData = (timestamp: number, values: number[]) => {
        values.forEach((v, i) => {
            seriesData[i].push([timestamp, v])
            if (seriesData[i].length > maxLength) {
                seriesData[i].shift()
                // chart?.setOption({ animation: false })
            }
        })

        chart?.setOption({ series: seriesData.map((data) => ({ data })) })
    }

    export const appendData = (timestamp: number, ...values: number[]) => {
        if (!chart) {
            buffer.push({ timestamp, values })
            return
        }
        pushData(timestamp, values)
    }

    export const toggleSeriesVisibility = <T extends string>(
        seriesNames: T[],
        visible?: boolean
    ) => {
        if (!chart) {
            return
        }

        const option = chart.getOption() as { legend: { selected: { [key: string]: boolean } }[] }
        const {
            legend: { 0: series }
        } = option

        if (visible != null) {
            seriesNames.forEach((name) => {
                series.selected[name] = visible
            })
            return chart.setOption(option)
        }

        const findInvisibleSeries = seriesNames.find((name) => !series.selected[name])

        seriesNames.forEach((name) => {
            if (findInvisibleSeries) {
                series.selected[name] = true
                return
            }
            series.selected[name] = !series.selected[name]
        })
        chart.setOption(option)
    }

    export const shiftData = (length: number = seriesData[0].length / 2) => {
        length = Math.max(seriesData[0].length, length)
        seriesNames.forEach((_v, i) => {
            for (let j = 0; j < length; j++) {
                seriesData[i].shift()
            }
        })
    }

    onMount(() => {
        initChart()

        const resize = () => chart.resize()
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
            chart.dispose()
        }
    })
</script>

<div {...restProps}>
    <div bind:this={chartDom} class="h-full w-full"></div>
</div>

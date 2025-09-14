/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from 'recharts'
import { Watch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface WatchComparisonChartProps {
  watch: Watch
  allWatches: Watch[]
  field: keyof Watch
  label: string
  color: string
}

export function WatchComparisonChart({
  watch,
  allWatches,
  field,
  label,
  color,
}: WatchComparisonChartProps) {
  if (!allWatches) return null

  const values = allWatches
    .map((w) => Number(w[field]))
    .filter((v) => !isNaN(v))

  const min = Math.min(...values)
  const max = Math.max(...values)
  const current = Number(watch[field])

  // Escala personalizada solo para el precio
  const priceScale =
    label === 'price'
      ? [0, 1000, 5000, 20000, 100000, 500000, 1000000, 2000000]
      : []

  const normalizeValue = (value: number) => {
    if (label !== 'price') return value
    for (let i = 0; i < priceScale.length - 1; i++) {
      const start = priceScale[i]
      const end = priceScale[i + 1]
      if (value <= end) {
        // posición relativa entre start y end (0–1)
        const ratio = (value - start) / (end - start)
        return i + ratio // posición "normalizada" en la escala de ticks
      }
    }
    return priceScale.length - 1
  }

  const data = [
    // { name: 'Mínimo', value: normalizeValue(min), realValue: min },
    { name: watch.pattern, value: normalizeValue(current), realValue: current },
    // { name: 'Máximo', value: normalizeValue(max), realValue: max },
  ]

  const xTicks = field === 'price' ? priceScale.map((v, i) => i) : undefined

  return (
    <Card>
      <CardHeader className='border-b h-10'>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className='h-40 w-full rounded-lg'
          config={{ value: { label, color } }}
        >
          <BarChart
            data={data}
            layout='vertical'
            margin={{ left: 10, right: 20, top: 0, bottom: 0 }}
          >
            <YAxis
              dataKey='name'
              type='category'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
            />
            <XAxis
              type='number'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              ticks={xTicks}
              tickFormatter={(tick) =>
                label === 'price' ? `€${priceScale[tick]}` : tick
              }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey='value'
              fill={color}
              radius={[0, 4, 4, 0]}
              barSize={10}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function WatchComparisonPriceChart({
  watch,
  allWatches,
  field,
  label,
  color,
}: WatchComparisonChartProps) {
  if (!allWatches) return null

  const values = allWatches
    .map((w) => Number(w[field]))
    .filter((v) => !isNaN(v))

  // Escala de precios (baremos)
  const priceScale = [0, 1000, 5000, 20000, 100000, 500000, 1000000, 2000000]

  // Calcular cantidad de relojes por rango
  const bars = priceScale.slice(0, -1).map((start, i) => {
    const end = priceScale[i + 1]
    const watchesInRange = values.filter((v) => v > start && v <= end)
    return {
      range: `${start}-${end}`,
      count: watchesInRange.length,
      start,
      end,
    }
  })

  // Saber en qué rango está el reloj actual
  const currentPrice = Number(watch[field])
  const currentRangeIndex = bars.findIndex(
    (b) => currentPrice > b.start && currentPrice <= b.end
  )

  return (
    <Card>
      <CardHeader className='border-b h-10'>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className='h-60 w-full rounded-lg'
          config={{ value: { label, color } }}
        >
          <BarChart
            data={bars}
            layout='vertical'
            margin={{ left: 60, right: 20, top: 20, bottom: 20 }}
          >
            <YAxis
              dataKey='range'
              type='category'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <XAxis
              type='number'
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              label={{
                value: 'Cantidad de relojes',
                position: 'insideBottom',
                offset: -5,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: any) => `${value} relojes`}
                />
              }
            />
            <Bar
              dataKey='count'
              fill={color}
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            {currentRangeIndex >= 0 && (
              <ReferenceLine
                y={bars[currentRangeIndex].range}
                stroke='red'
                strokeWidth={2}
                label={{
                  value: `Reloj: €${currentPrice}`,
                  position: 'insideRight',
                  fill: 'red',
                  fontSize: 12,
                }}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

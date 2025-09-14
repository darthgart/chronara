/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWatches, Watch } from '@/lib/api'
import { Header } from '@/components/header/header'
import { SingleSelect } from '@/components/watches/SingleSelector'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { getTypeColor, MAX_WATCH_COMPARE } from '@/lib/config'
import { WatchIcon } from 'lucide-react'
import { useComparatorStore } from '@/store'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
} from 'recharts'

const getBarData = (
  watchesData: Watch[],
  selectedIds: string[],
  key: keyof Watch,
  label: string
) => {
  return selectedIds.map((id, index) => {
    const watch = watchesData.find((w) => w.id === id)
    return {
      name: `Reloj ${index + 1}`,
      value: watch ? watch[key] : 0,
      label: watch ? `${watch.brand} ${watch.pattern}` : '',
    }
  })
}

export default function ComparatorPage() {
  const { data: watches } = useQuery<Watch[]>({
    queryKey: ['watches'],
    queryFn: fetchWatches,
  })

  const { selected, addWatch, removeWatch } = useComparatorStore()

  const [selectedIds, setSelectedIds] = useState<string[]>(
    Array.from({ length: MAX_WATCH_COMPARE }, (_, i) => selected[i] || '')
  )

  useEffect(() => {
    selectedIds.forEach((id, index) => {
      const oldId = selected[index]
      if (oldId && oldId !== id) removeWatch(oldId)
      if (id && !selected.includes(id)) addWatch(id)
    })
  }, [selectedIds, addWatch, removeWatch, selected])

  const handleSelect = (index: number, value: string) => {
    const id = value ? value.split('|')[0] : ''
    const updated = [...selectedIds]
    updated[index] = id
    setSelectedIds(updated)
  }

  const availableWatches = (index: number) =>
    watches
      ?.filter(
        (w) => !selectedIds.includes(w.id) || selectedIds[index] === w.id
      )
      .map((w) => `${w.id}|${w.brand} - ${w.pattern}`) ?? []

  // Datos para gráfico Radar
  const radarData = selectedIds
    .map((id, idx) => {
      const watch = watches?.find((w) => w.id === id)
      return watch
        ? {
            subject: 'Precio',
            [`Reloj ${idx + 1}`]: watch.price,
            subject2: 'Diámetro',
            [`Reloj ${idx + 1}D`]: watch.diameter,
            subject3: 'Agua',
            [`Reloj ${idx + 1}A`]: watch.water_resistance,
            subject4: 'Año',
            [`Reloj ${idx + 1}Y`]: watch.releaseDate,
          }
        : null
    })
    .filter(Boolean)

  return (
    <main className='flex flex-col gap-12 items-center'>
      <Header />
      <div className='p-8 px-4 sm:px-20 mt-20 w-full max-w-7xl mx-auto'>
        <h2 className='text-3xl font-light mb-8 text-center'>Comparador</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          {selectedIds.map((id, index) => {
            const watch = watches?.find((w) => w.id === id)

            return (
              <div
                key={index}
                className='flex flex-col items-center p-5 border rounded-xl w-full'
              >
                <div className='w-full py-2'>
                  <SingleSelect
                    label={`Reloj ${index + 1}`}
                    value={watch ? `${watch.brand} - ${watch.pattern}` : ''}
                    onChange={(val: any) => handleSelect(index, val)}
                    options={availableWatches(index)}
                    placeholder='Selecciona un reloj...'
                    className='w-full max-w-md'
                  />
                </div>

                <AnimatePresence>
                  {watch ? (
                    <motion.div
                      key={watch.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className='rounded-lg flex flex-col gap-4 w-full mt-4'
                    >
                      <div className='flex flex-col items-center'>
                        <img
                          src={watch.image_url}
                          alt={watch.pattern}
                          className='w-40 h-40 object-contain rounded mb-4'
                        />
                      </div>

                      <div className='bg-card'>
                        <ul className='border rounded-lg divide-y'>
                          <h3 className='font-semibold text-lg text-center py-2'>
                            {watch.brand}
                            <br />
                            {watch.pattern}
                          </h3>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Movimiento:
                            </span>
                            <span className='col-span-7'>{watch.movement}</span>
                          </li>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Tipo:
                            </span>
                            <span className='col-span-7 flex flex-wrap gap-1'>
                              {watch.type?.map((t) => (
                                <Badge key={t} className={`${getTypeColor(t)}`}>
                                  {t}
                                </Badge>
                              ))}
                            </span>
                          </li>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Precio:
                            </span>
                            <span className='col-span-7'>{watch.price} €</span>
                          </li>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Diámetro:
                            </span>
                            <span className='col-span-7'>
                              {watch.diameter} mm
                            </span>
                          </li>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Resistencia al agua:
                            </span>
                            <span className='col-span-7'>
                              {watch.water_resistance} m
                            </span>
                          </li>
                          <li className='grid grid-cols-12 px-4 py-2'>
                            <span className='font-semibold col-span-5'>
                              Año de lanzamiento:
                            </span>
                            <span className='col-span-7'>
                              {watch.releaseDate}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`empty-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className='border rounded-lg flex flex-col items-center justify-center w-full shadow-lg bg-card text-center text-muted-foreground'
                      style={{ minHeight: '450px' }}
                    >
                      <WatchIcon className='w-16 h-16 mb-4 opacity-50' />
                      <p>Selecciona un reloj para comparar</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        {/* Gráfico comparativo */}
        {selectedIds.every((id) => id) && (
          // <div className='w-full mt-12 h-80'>
          //   <ResponsiveContainer width='100%' height='100%'>
          //     <RadarChart
          //       cx='50%'
          //       cy='50%'
          //       outerRadius='80%'
          //       data={[
          //         {
          //           subject: 'Precio',
          //           [`Reloj 1`]: watches?.find((w) => w.id === selectedIds[0])
          //             ?.price,
          //           [`Reloj 2`]: watches?.find((w) => w.id === selectedIds[1])
          //             ?.price,
          //         },
          //         {
          //           subject: 'Diámetro',
          //           [`Reloj 1`]: watches?.find((w) => w.id === selectedIds[0])
          //             ?.diameter,
          //           [`Reloj 2`]: watches?.find((w) => w.id === selectedIds[1])
          //             ?.diameter,
          //         },
          //         {
          //           subject: 'Agua',
          //           [`Reloj 1`]: watches?.find((w) => w.id === selectedIds[0])
          //             ?.water_resistance,
          //           [`Reloj 2`]: watches?.find((w) => w.id === selectedIds[1])
          //             ?.water_resistance,
          //         },
          //         {
          //           subject: 'Año',
          //           [`Reloj 1`]: watches?.find((w) => w.id === selectedIds[0])
          //             ?.releaseDate,
          //           [`Reloj 2`]: watches?.find((w) => w.id === selectedIds[1])
          //             ?.releaseDate,
          //         },
          //       ]}
          //     >
          //       <PolarGrid />
          //       <PolarAngleAxis dataKey='subject' />
          //       <PolarRadiusAxis />
          //       <Tooltip />
          //       <Radar
          //         name='Reloj 1'
          //         dataKey='Reloj 1'
          //         stroke='#8884d8'
          //         fill='#8884d8'
          //         fillOpacity={0.3}
          //       />
          //       <Radar
          //         name='Reloj 2'
          //         dataKey='Reloj 2'
          //         stroke='#82ca9d'
          //         fill='#82ca9d'
          //         fillOpacity={0.3}
          //       />
          //     </RadarChart>
          //   </ResponsiveContainer>
          // </div>
          <div className='w-full mt-12 space-y-8'>
            {['price', 'diameter', 'water_resistance', 'releaseDate'].map(
              (key, i) => (
                <div
                  key={i}
                  className='w-full h-56 border rounded-lg p-4 bg-card'
                >
                  <h3 className='text-center font-semibold mb-2'>
                    {key === 'price'
                      ? 'Precio (€)'
                      : key === 'diameter'
                        ? 'Diámetro (mm)'
                        : key === 'water_resistance'
                          ? 'Resistencia al agua (m)'
                          : 'Año de lanzamiento'}
                  </h3>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={getBarData(
                        watches!,
                        selectedIds,
                        key as keyof Watch,
                        key
                      )}
                    >
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip formatter={(value: any) => value} />
                      <Bar dataKey='value' fill='#82ca9d'>
                        <LabelList dataKey='label' position='top' />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  )
}

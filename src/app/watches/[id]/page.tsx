'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWatch, fetchWatches, Watch } from '@/lib/api'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header/header'
import { Spinner } from '@/components/ui/spinner'
import {
  WatchComparisonChart,
  WatchComparisonPriceChart,
} from '@/components/watches/WatchComparisonChart'
import { getTypeColor } from '@/lib/config'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function WatchDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const { data: watch, isLoading } = useQuery<Watch>({
    queryKey: ['watch', id],
    queryFn: () => fetchWatch(id),
    enabled: !!id,
  })

  const { data: allWatches } = useQuery<Watch[]>({
    queryKey: ['watches'],
    queryFn: fetchWatches,
  })

  if (isLoading) return <Spinner />
  if (!watch) return <p>No encontrado</p>

  return (
    <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
      <Header />
      <motion.div
        className='p-8 max-w-5xl mx-auto mt-20'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='grid md:grid-cols-2 gap-10 items-start'>
          <motion.div
            className='p-5 border rounded-lg bg-foreground/5'
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={watch.image_url}
              alt={watch.pattern}
              className='w-full h-96 object-contain rounded-lg mb-4'
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-2xl px-2 mb-4 font-light'>
              {watch.brand} {watch.pattern}
            </h2>
            <ul className='border rounded-lg'>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Movimiento:
                </span>
                <span className='col-span-7 p-3'>{watch.movement}</span>
              </li>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Tipo:
                </span>
                <span className='col-span-7 p-3 flex flex-wrap gap-1 text-muted-foreground'>
                  {watch.type && Array.isArray(watch.type) ? (
                    watch.type.map((t) => (
                      <Badge key={t} className={`${getTypeColor(t)}`}>
                        {t}
                      </Badge>
                    ))
                  ) : (
                    <Badge>{watch.type}</Badge>
                  )}
                </span>
              </li>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Precio:
                </span>
                <span className='col-span-7 p-3'>{watch.price} €</span>
              </li>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Diámetro:
                </span>
                <span className='col-span-7 p-3'>{watch.diameter} mm</span>
              </li>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Material:
                </span>
                <span className='col-span-7 p-3'>{watch.material}</span>
              </li>
              <li className='grid grid-cols-12 px-5 border-b'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Resistencia al agua:
                </span>
                <span className='col-span-7 p-3'>
                  {watch.water_resistance} m
                </span>
              </li>
              <li className='grid grid-cols-12 px-5'>
                <span className='font-semibold py-3 border-r col-span-5'>
                  Año de lanzamiento:
                </span>
                <span className='col-span-7 p-3'>{watch.releaseDate}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className='mt-10'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className='m-2 text-muted-foreground'>{watch.description}</p>
        </motion.div>

        {allWatches && (
          <motion.div
            className='mt-16 space-y-8'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className='text-2xl font-light mb-4'>
              Comparativa con otros relojes
            </h3>
            <div className='grid md:grid-cols-2 gap-8'>
              <WatchComparisonChart
                watch={watch}
                allWatches={allWatches}
                field='diameter'
                label='Diámetro (mm)'
                color='var(--foreground)'
              />
              <WatchComparisonChart
                watch={watch}
                allWatches={allWatches}
                field='water_resistance'
                label='Resistencia al agua (m)'
                color='var(--foreground)'
              />
            </div>
            <WatchComparisonPriceChart
              watch={watch}
              allWatches={allWatches}
              field='price'
              label='Precio (€)'
              color='var(--foreground)'
            />
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}

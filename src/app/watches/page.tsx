'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWatches, Watch } from '@/lib/api'
import Link from 'next/link'
import { Header } from '@/components/header/header'
import { WatchFilters } from '@/components/watches/WatchFilters'
import { useState } from 'react'

export default function WatchesPage() {
  const { data, isLoading } = useQuery<Watch[]>({
    queryKey: ['watches'],
    queryFn: fetchWatches,
  })

  const [filtered, setFiltered] = useState<Watch[]>([])

  if (isLoading) return <p>Cargando...</p>
  if (!data) return <p>No hay relojes disponibles</p>

  return (
    <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
      <Header />
      <div className='p-8 px-20 mt-20'>
        <h2 className='text-3xl font-light mb-6'>Colección</h2>
        <WatchFilters watches={data} onFilter={setFiltered} />
        <ul className='grid gap-6 sm:grid-cols-2 md:grid-cols-3'>
          {filtered?.map((watch) => (
            <li
              key={watch.id}
              className='border p-4 rounded-lg hover:shadow-lg flex gap-4 items-center'
            >
              {/* Imagen */}
              <div className='w-1/3'>
                <img
                  src={watch.image_url}
                  alt={watch.pattern}
                  className='rounded-lg object-contain w-full h-32'
                />
              </div>

              {/* Información */}
              <div className='w-2/3'>
                <h3 className='font-medium'>{watch.brand}</h3>
                <p>{watch.pattern}</p>
                <p className='text-sm text-muted-foreground'>
                  {watch.type.join(', ')} - {watch.movement}
                </p>
                <Link
                  href={`/watches/${watch.id}`}
                  className='text-primary mt-2 block'
                >
                  Ver detalles →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

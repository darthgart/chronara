'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchWatch, Watch } from '@/lib/api'
import { useParams } from 'next/navigation'
import { Header } from '@/components/header/header'

export default function WatchDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const { data, isLoading } = useQuery<Watch>({
    queryKey: ['watch', id],
    queryFn: () => fetchWatch(id),
    enabled: !!id,
  })

  if (isLoading) return <p>Cargando...</p>
  if (!data) return <p>No encontrado</p>

  return (
    <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
      <Header />
      <div className='p-8 max-w-3xl mx-auto mt-20'>
        <h2 className='text-3xl font-light mb-4'>
          {data.brand} {data.pattern}
        </h2>
        <img
          src={data.image_url}
          alt={data.pattern}
          className='w-full h-96 object-cover rounded-lg mb-6'
        />
        <p className='text-muted-foreground mb-4'>{data.description}</p>
        <ul className='space-y-2'>
          <li>
            <strong>Precio:</strong> {data.price} €
          </li>
          <li>
            <strong>Movimiento:</strong> {data.movement}
          </li>
          <li>
            <strong>Diámetro:</strong> {data.diameter}
          </li>
          <li>
            <strong>Material:</strong> {data.material}
          </li>
          <li>
            <strong>Resistencia al agua:</strong> {data.water_resistance}
          </li>
          <li>
            <strong>Lanzamiento:</strong>{' '}
            {new Date(data.releaseDate).toLocaleDateString()}
          </li>
        </ul>
      </div>
    </main>
  )
}

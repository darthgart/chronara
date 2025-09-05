'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchWatches, Watch } from '@/lib/api'

export default function ComparatorPage() {
  const { data: watches } = useQuery<Watch[]>({
    queryKey: ['watches'],
    queryFn: fetchWatches,
  })

  const [first, setFirst] = useState<string>('')
  const [second, setSecond] = useState<string>('')

  const w1 = watches?.find((w) => w.id === first)
  const w2 = watches?.find((w) => w.id === second)

  return (
    <div className='p-8'>
      <h2 className='text-3xl font-light mb-6'>Comparador</h2>
      <div className='flex gap-4 mb-8'>
        <select
          onChange={(e) => setFirst(e.target.value)}
          className='border p-2 rounded'
        >
          <option value=''>Selecciona reloj 1</option>
          {watches?.map((w) => (
            <option key={w.id} value={w.id}>
              {w.brand} - {w.pattern}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSecond(e.target.value)}
          className='border p-2 rounded'
        >
          <option value=''>Selecciona reloj 2</option>
          {watches?.map((w) => (
            <option key={w.id} value={w.id}>
              {w.brand} - {w.pattern}
            </option>
          ))}
        </select>
      </div>

      {w1 && w2 && (
        <div className='grid grid-cols-2 gap-6'>
          {[w1, w2].map((w) => (
            <div key={w.id} className='border p-4 rounded-lg'>
              <h3 className='font-medium'>
                {w.brand} {w.pattern}
              </h3>
              <p>
                <strong>Precio:</strong> {w.price} €
              </p>
              <p>
                <strong>Movimiento:</strong> {w.movement}
              </p>
              <p>
                <strong>Diámetro:</strong> {w.diameter}
              </p>
              <p>
                <strong>Material:</strong> {w.material}
              </p>
              <p>
                <strong>Resistencia al agua:</strong> {w.water_resistance}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

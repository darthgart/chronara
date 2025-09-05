'use client'

import { useState, useMemo } from 'react'
import { Watch } from '@/lib/api'
import { MultiSelect } from './MultiSelector'
import { SingleSelect } from './SingleSelector'
import { Input } from '../ui/input'

interface WatchFiltersProps {
  watches: Watch[]
  onFilter: (filtered: Watch[]) => void
}

function normalizeMovement(movement: string): string {
  if (!movement) return 'Otro'
  const m = movement.toLowerCase()
  if (m.includes('auto')) return 'Automático'
  if (m.includes('manual')) return 'Manual'
  if (m.includes('cuarzo') || m.includes('Quarz')) return 'Cuarzo'
  if (m.includes('solar')) return 'Solar'
  return 'Otro'
}

export function WatchFilters({ watches, onFilter }: WatchFiltersProps) {
  const [brand, setBrand] = useState('')
  const [pattern, setPattern] = useState('')
  const [types, setTypes] = useState<string[]>([])
  const [movement, setMovement] = useState('')

  // listas únicas para selects
  const brands = useMemo(
    () => Array.from(new Set(watches.map((w) => w.brand))),
    [watches]
  )
  const typesList = useMemo(
    () => Array.from(new Set(watches.flatMap((w) => w.type))),
    [watches]
  )
  const movements = useMemo(
    () =>
      Array.from(new Set(watches.map((w) => normalizeMovement(w.movement)))),
    [watches]
  )

  // filtrar
  const filtered = useMemo(() => {
    return watches.filter((w) => {
      const matchesBrand = brand ? w.brand === brand : true
      const matchesPattern = pattern
        ? (w.pattern ?? '').toLowerCase().includes(pattern.toLowerCase())
        : true
      const matchesTypes =
        types.length > 0 ? types.every((t) => (w.type ?? []).includes(t)) : true
      const matchesMovement = movement
        ? normalizeMovement(w.movement ?? '') === movement
        : true

      return matchesBrand && matchesPattern && matchesTypes && matchesMovement
    })
  }, [watches, brand, pattern, types, movement])

  // notificar resultados
  onFilter(filtered)

  return (
    <div className='mb-8 grid gap-4 md:grid-cols-4'>
      {/* Marca */}
      <div>
        <SingleSelect
          label='Marca'
          options={brands}
          value={brand}
          onChange={setBrand}
          placeholder='Selecciona marca'
        />
      </div>

      {/* Modelo */}
      <div>
        <label className='block text-sm font-medium mb-1'>Modelo</label>
        <Input
          type='text'
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder='Escribe un modelo...'
        />
      </div>

      {/* Tipos */}
      <div>
        <label className='block text-sm font-medium mb-1'>Tipos</label>
        <MultiSelect options={typesList} value={types} onChange={setTypes} />
      </div>
      {/* Movimiento */}
      <div>
        <SingleSelect
          label='Movimiento'
          options={movements}
          value={movement}
          onChange={setMovement}
          placeholder='Selecciona movimiento'
        />
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo, useEffect } from 'react'
import { Watch } from '@/lib/api'
import { MultiSelect } from './MultiSelector'
import { SingleSelect } from './SingleSelector'
import { Input } from '../ui/input'
import { useFiltersStore } from '@/store'
import { Button } from '../ui/button'
import { Trash } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface WatchFiltersProps {
  watches: Watch[]
  onFilter: (filtered: Watch[]) => void
}

function normalizeMovement(movement: string): string {
  if (!movement) return 'Otro'
  const m = movement.toLowerCase()
  if (m.includes('auto')) return 'Automático'
  if (m.includes('manual')) return 'Manual'
  if (m.includes('cuarzo') || m.includes('quarz')) return 'Cuarzo'
  if (m.includes('solar')) return 'Solar'
  return 'Otro'
}

export function WatchFilters({ watches, onFilter }: WatchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [brand, setBrand] = useState(searchParams.get('brand') || '')
  const [pattern, setPattern] = useState(searchParams.get('pattern') || '')
  const [types, setTypes] = useState<string[]>(
    searchParams.get('types') ? searchParams.get('types')!.split(',') : []
  )
  const [movement, setMovement] = useState(searchParams.get('movement') || '')

  const brands = useMemo(
    () =>
      Array.from(new Set(watches.map((w) => w.brand))).sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
      ),
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

  useEffect(() => {
    const params = new URLSearchParams()
    if (brand) params.set('brand', brand)
    if (pattern) params.set('pattern', pattern)
    if (types.length > 0) params.set('types', types.join(','))
    if (movement) params.set('movement', movement)

    router.replace(`/watches?${params.toString()}`)
  }, [brand, pattern, types, movement, router])

  const filtered = useMemo(() => {
    return watches.filter((w) => {
      const matchesBrand = brand ? w.brand === brand : true
      const matchesPattern = pattern
        ? (w.pattern ?? '').toLowerCase().includes(pattern.toLowerCase())
        : true
      const matchesTypes =
        types.length > 0 ? (w.type ?? []).some((t) => types.includes(t)) : true
      const matchesMovement = movement
        ? normalizeMovement(w.movement ?? '') === movement
        : true

      return matchesBrand && matchesPattern && matchesTypes && matchesMovement
    })
  }, [watches, brand, pattern, types, movement])

  useEffect(() => {
    onFilter(filtered)
  }, [filtered, onFilter])

  function cleanFields() {
    setBrand('')
    setMovement('')
    setPattern('')
    setTypes([])
  }

  return (
    <div className='mb-8 grid gap-4 md:grid-cols-5 border rounded-lg p-5'>
      <div>
        <SingleSelect
          label='Marca'
          options={brands}
          value={brand}
          onChange={setBrand}
          placeholder='Selecciona marca'
          className='max-w-52'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Modelo</label>
        <Input
          type='text'
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder='Escribe un modelo...'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Tipos</label>
        <MultiSelect
          options={typesList}
          value={types}
          onChange={setTypes}
          className='max-w-52'
        />
      </div>
      <div>
        <SingleSelect
          label='Movimiento'
          options={movements}
          value={movement}
          onChange={setMovement}
          placeholder='Selecciona movimiento'
          className='max-w-52'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>Limpiar</label>
        <Button onClick={cleanFields}>
          <Trash />
        </Button>
      </div>
    </div>
  )
}

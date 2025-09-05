/* eslint-disable @typescript-eslint/no-explicit-any */
import watchesData from '@/../public/data/watches.json'

export type Watch = {
  _id: string
  id: string
  brand: string
  pattern: string
  type: string[]
  price: number
  releaseDate: string
  image_url: string
  water_resistance: string
  diameter: string
  movement: string
  material: string
  description: string
}

export type Type = {
  id: string
  name: string
  description: string
}

// export async function fetchWatches() {
//   const res = await fetch('/api/watches', { cache: 'no-store' })
//   if (!res.ok) throw new Error('Error fetching watches')
//   return res.json()
// }

// export async function fetchWatch(id: string) {
//   const res = await fetch(`/api/watches/${id}`, { cache: 'no-store' })
//   if (!res.ok) throw new Error('Error fetching watch')
//   return res.json()
// }

export async function fetchTypes() {
  const res = await fetch('/api/types', { cache: 'no-store' })
  if (!res.ok) throw new Error('Error fetching watches')
  return res.json()
}

//JSON
// Método 1: importar directamente (ideal en dev)
// export async function fetchWatches(): Promise<Watch[]> {
//   return watchesData as Watch[]
// }

// Método 2: fetch al JSON en public (simula API, mejor si lo quieres “igual” que en producción)
export async function fetchWatches(): Promise<Watch[]> {
  const res = await fetch('/data/watches.json')
  if (!res.ok) throw new Error('Error loading local data')
  const raw = await res.json()

  return raw.map((w: any) => ({
    _id: w._id,
    id: w.id,
    brand: w.brand,
    pattern: w.pattern, // 👈 pattern → model
    description: w.description,
    type: Array.isArray(w.type) ? w.type : [w.type], // 👈 aseguramos array
    image_url: w.image_url,
    price: w.price,
    releaseDate: w.releaseDate,
    water_resistance: w.water_resistance,
    diameter: w.diameter,
    movement: w.movement,
    material: w.material,
  }))
}

export async function fetchWatch(id: string): Promise<Watch> {
  const res = await fetch('/data/watches.json')
  if (!res.ok) throw new Error('Error loading local data')
  const watches: Watch[] = await res.json()

  const watch = watches.find((w) => w.id === id)
  if (!watch) throw new Error('Watch not found')

  return watch
}

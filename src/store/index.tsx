import { MAX_WATCH_COMPARE } from '@/lib/config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ComparatorStore {
  selected: string[] // guardamos solo los IDs
  addWatch: (id: string) => void
  removeWatch: (id: string) => void
  clear: () => void
}

export const useComparatorStore = create<ComparatorStore>()(
  persist(
    (set, get) => ({
      selected: [],
      addWatch: (id) => {
        const current = get().selected
        if (current.includes(id)) return
        if (current.length >= MAX_WATCH_COMPARE) return // max 5
        set({ selected: [...current, id] })
      },
      removeWatch: (id) => {
        set({ selected: get().selected.filter((x) => x !== id) })
      },
      clear: () => set({ selected: [] }),
    }),
    { name: 'comparator-storage' }
  )
)

interface FiltersStore {
  brand: string
  pattern: string
  types: string[]
  movement: string
  setBrand: (v: string) => void
  setPattern: (v: string) => void
  setTypes: (v: string[]) => void
  setMovement: (v: string) => void
  resetFilters: () => void
}

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      brand: '',
      pattern: '',
      types: [],
      movement: '',
      setBrand: (v) => set({ brand: v }),
      setPattern: (v) => set({ pattern: v }),
      setTypes: (v) => set({ types: v }),
      setMovement: (v) => set({ movement: v }),
      resetFilters: () =>
        set({ brand: '', pattern: '', types: [], movement: '' }),
    }),
    { name: 'filters-storage' }
  )
)

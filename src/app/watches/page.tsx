/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'
import { fetchWatches, Watch } from '@/lib/api'
import { Header } from '@/components/header/header'
import { WatchFilters } from '@/components/watches/WatchFilters'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useComparatorStore } from '@/store'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { getTypeColor, PAGE_SIZE } from '@/lib/config'
import { ArrowLeftCircle, ArrowRightCircle, WatchIcon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SuggestWatchForm } from '@/components/form/SuggestWatchForm'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'motion/react'

export default function WatchesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data, isLoading } = useQuery<Watch[]>({
    queryKey: ['watches'],
    queryFn: fetchWatches,
  })

  const [filtered, setFiltered] = useState<Watch[]>([])

  const { selected, addWatch, removeWatch } = useComparatorStore()

  const initialPage = Number(searchParams.get('page')) || 1
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (page > 1) {
      params.set('page', page.toString())
    } else {
      params.delete('page')
    }
    router.replace(`/watches?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    setPage(1)
  }, [filtered])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  if (isLoading) return <Spinner />
  if (!data) return <p>No hay relojes disponibles</p>

  return (
    <main className='flex flex-col gap-[32px] row-start-2 items-center justify-center sm:items-start'>
      <Header />
      <div className='p-8 px-20 mt-20 max-w-7xl mx-auto'>
        <motion.h2
          className='text-3xl font-light mb-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Colección
        </motion.h2>

        {/* Animación filtros */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <WatchFilters watches={data} onFilter={(f) => setFiltered(f)} />
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            className='text-center mt-12'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <WatchIcon />
            <p className='text-lg'>¿No encuentras el reloj que buscas?</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='mt-4'>Envíanos tu propuesta</Button>
              </DialogTrigger>
              <DialogContent className='max-w-lg'>
                <DialogHeader>
                  <DialogTitle>Proponer un reloj</DialogTitle>
                  <DialogDescription className='my-2 text-foreground/50'>
                    Hola, por favor rellena el siguiente formulario con tu
                    propuesta
                  </DialogDescription>
                </DialogHeader>
                <SuggestWatchForm />
              </DialogContent>
            </Dialog>
          </motion.div>
        ) : (
          <>
            {/* Lista con animación */}
            <motion.ul
              className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 justify-center'
              initial='hidden'
              animate='visible'
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
            >
              {paginated.map((watch) => (
                <motion.li
                  key={watch.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className='border p-4 rounded-lg hover:shadow-lg flex gap-4 items-center'
                >
                  <div className='w-1/3'>
                    <img
                      src={watch.image_url}
                      alt={watch.pattern}
                      className='rounded-lg object-contain w-full h-32'
                    />
                  </div>

                  <div className='w-2/3'>
                    <h3 className='font-medium'>{watch.brand}</h3>
                    <p>{watch.pattern}</p>
                    <p className='text-sm text-muted-foreground'>
                      {watch.movement}
                    </p>
                    <p className='flex flex-wrap gap-1 text-sm text-muted-foreground'>
                      {watch.type.map((t) => (
                        <Badge key={t} className={`my-1 ${getTypeColor(t)}`}>
                          {t}
                        </Badge>
                      ))}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      Precio: {watch.price} €
                    </p>
                    <Button variant='outline' size='sm' className='mt-2 mr-2'>
                      <Link href={`/watches/${watch.id}`}>Ver detalles</Link>
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='mt-2'
                      onClick={() =>
                        selected.includes(watch.id)
                          ? removeWatch(watch.id)
                          : addWatch(watch.id)
                      }
                    >
                      {selected.includes(watch.id) ? 'Quitar' : 'Comparar'}
                    </Button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            {totalPages > 1 && (
              <div className='flex justify-end my-10 gap-2'>
                <Button
                  variant='ghost'
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ArrowLeftCircle />
                </Button>
                <span className='mt-1'>
                  {page} de {totalPages}
                </span>
                <Button
                  variant='ghost'
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ArrowRightCircle />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed bottom-4 left-1/2 -translate-x-1/2 border bg-background shadow-lg rounded-lg p-4 flex gap-4 items-center z-50'
          >
            <div className='flex gap-2'>
              <AnimatePresence>
                {selected.map((id) => {
                  const w = data.find((x) => x.id === id)
                  return (
                    <motion.div
                      key={id}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className='flex flex-col items-center border bg-background/10 rounded-lg'
                    >
                      <img
                        src={w?.image_url}
                        alt={w?.pattern}
                        className='w-12 h-12 p-2 object-contain rounded'
                      />
                      <button
                        className='text-xs text-red-500'
                        onClick={() => removeWatch(id)}
                      >
                        ✕
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <Button
              className='cursor-pointer'
              onClick={() => router.push('/comparator')}
            >
              Comparar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

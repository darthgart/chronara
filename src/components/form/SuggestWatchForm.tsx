'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function SuggestWatchForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const payload = Object.fromEntries(formData.entries())

    try {
      setLoading(true)
      // Aquí lo puedes enviar a tu API
      const res = await fetch('/api/suggest-watch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Error al enviar la propuesta')

      alert('¡Gracias por tu propuesta!')
      e.currentTarget.reset()
    } catch (err) {
      console.error(err)
      alert('Hubo un error, inténtalo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
      <Input className='col-span-1' placeholder='Nombre' name='name' required />
      <Input
        className='col-span-1'
        placeholder='Email'
        name='email'
        type='email'
        required
      />
      <Textarea
        className='col-span-2 min-h-20'
        placeholder='Dime que reloj te gustaría que añadieramos...'
        name='description'
        required
      />
      <Button type='submit' className='mt-2'>
        Enviar propuesta
      </Button>
    </form>
  )
}

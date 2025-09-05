'use client'

import dynamic from 'next/dynamic'
import { Spinner } from '../ui/spinner'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'

const ThemeToggle = dynamic(() => import('@/components/theme/theme-toggle'), {
  loading: () => (
    <div className='w-12 h-12 rounded-full inline-flex items-center justify-center '>
      <Spinner size='sm' variant='light' />
    </div>
  ),
})

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // o un spinner si quieres

  const effectiveMode = theme === 'system' ? resolvedTheme : theme
  const logoSrc =
    effectiveMode === 'light' ? '/logo-light.png' : '/logo-dark.png'

  return (
    <div className='relative w-full py-4 border-white/20 transition-all ease-in-out h-20 bg-background'>
      <div className='w-full mx-auto max-w-8xl px-10 h-full'>
        <nav className='flex items-center justify-between h-full relative'>
          <div className='flex items-center gap-2 absolute left-0'>
            <Link href='/' passHref>
              <Button
                asChild
                variant='link'
                className='mx-5 font-normal tracking-wider'
              >
                <span>HOME</span>
              </Button>
            </Link>
            <Link href='/watches' passHref>
              <Button
                asChild
                variant='link'
                className='mx-5 font-normal tracking-wider'
              >
                <span>WATCHES</span>
              </Button>
            </Link>
            <Link href='/comparator' passHref>
              <Button
                asChild
                variant='link'
                className='mx-5 font-normal tracking-wider'
              >
                <span>COMPARATOR</span>
              </Button>
            </Link>
          </div>
          <div className='absolute left-1/2 transform -translate-x-1/2 mt-2'>
            <Image
              src={logoSrc}
              alt='Logo Chronara'
              className='w-full min-w-[140px] max-w-[140px]'
              loading='lazy'
              width={140}
              height={50}
            />
          </div>
          <div className='absolute right-0 flex items-center gap-4'>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  )
}

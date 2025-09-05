'use client'
import React from 'react'
import type { ComponentProps } from 'react'
import clsx from 'clsx'

export interface SpinnerProps extends Omit<ComponentProps<'div'>, 'variant'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  variant?: 'light' | 'dark'
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'dark', ...props }, ref) => {
    const sizes: string[] = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
    ]
    const regex = /^\d+(px|rem|em|%|vh|vw|vmin|vmax)$/
    let sizeValue = size.toString()

    if (!regex.test(sizeValue) && !sizes.includes(sizeValue)) {
      sizeValue = '1rem'
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'inline-block flex-none rounded-full animate-spin',
          // tamaños
          size === 'xs' && 'w-4 h-4 border-[2px]',
          size === 'sm' && 'w-5 h-5 border-[2px]',
          size === 'md' && 'w-6 h-6 border-[2px]',
          size === 'lg' && 'w-7 h-7 border-[2px]',
          size === 'xl' && 'w-8 h-8 border-[2px]',
          size === '2xl' && 'w-9 h-9 border-[2px]',
          size === '3xl' && 'w-12 h-12',
          size === '4xl' && 'w-14 h-14',
          size === '5xl' && 'w-16 h-16',
          // variantes
          variant === 'dark' &&
            'border-[3px] border-black/20 border-t-black dark:border-white/30 dark:border-t-white',
          variant === 'light' && 'border-[3px] border-white/30 border-t-white',
          className
        )}
        style={
          regex.test(sizeValue) ? { width: sizeValue, height: sizeValue } : {}
        }
        {...props}
      >
        <span className='sr-only'>Loading...</span>
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export { Spinner }

'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface SingleSelectProps {
  label?: string
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SingleSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  className,
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className='space-y-1'>
      {label && <label className='block text-sm font-medium'>{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {value ? (
              value
            ) : (
              <span className='text-muted-foreground'>{placeholder}</span>
            )}
            <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${className} p-0 -mt-10`}>
          <Command>
            <CommandInput placeholder={`${label ?? ''}...`} />
            <CommandList>
              <CommandEmpty>No se encontraron resultados</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => {
                      onChange(option === value ? '' : option) // permite limpiar si se selecciona de nuevo
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

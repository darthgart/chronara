'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  const visibleValues = value.slice(0, 2)
  const extraCount = value.length - visibleValues.length

  return (
    <div className='space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
          >
            {value.length > 0 ? (
              <div className='flex flex-wrap gap-1'>
                {visibleValues.map((v) => (
                  <Badge
                    key={v}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {v}
                  </Badge>
                ))}
                {extraCount > 0 && (
                  <Badge
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    +{extraCount}
                  </Badge>
                )}
              </div>
            ) : (
              <span className='text-muted-foreground'>
                Seleccionar tipos...
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`${className} p-0`}>
          <Command>
            <CommandInput placeholder='Buscar tipo...' />
            <CommandList>
              <CommandEmpty>No se encontraron resultados</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    onSelect={() => toggleOption(option)}
                    className='cursor-pointer'
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(option) ? 'opacity-100' : 'opacity-0'
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

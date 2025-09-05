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
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

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
                {value.map((v) => (
                  <Badge
                    key={v}
                    variant='secondary'
                    className='flex items-center gap-1'
                  >
                    {v}
                    <X
                      className='h-3 w-3 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onChange(value.filter((item) => item !== v))
                      }}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              <span className='text-muted-foreground'>
                Seleccionar tipos...
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0'>
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

'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Calendar } from './calendar';

interface DatepickerProps {
  value?: Date;
  onChange?: (...event: any[]) => void;
  name?: string;
}
export function Datepicker({ name, value, onChange }: DatepickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[240px] pl-3 text-left font-normal', !value && 'text-muted-foreground')}
        >
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          autoFocus
        />
        <input
          type="date"
          className="hidden"
          name={name}
          value={value?.toDateString()}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}

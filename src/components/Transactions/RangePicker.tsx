import React, { useMemo, useState } from 'react';
import DatePicker from '../DatePicker.tsx';
import Popover from '../uikit/Popover.tsx';
import { CalendarDateRangeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../uikit/Button.tsx';
import { useTranslation } from 'react-i18next';
import type { DateRange } from 'react-day-picker';
import {
  endOfDay,
  endOfToday,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  subYears,
} from 'date-fns';

interface Props {
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

const premadeDates = [
  {
    label: 'all_dates',
    range: {
      from: () => undefined,
      to: () => undefined,
    },
  },
  {
    label: 'today',
    range: {
      from: () => startOfToday(),
      to: () => endOfToday(),
    },
  },
  {
    label: 'this_week',
    range: {
      from: () => startOfWeek(new Date()),
      to: () => endOfToday(),
    },
  },
  {
    label: 'this_month',
    range: {
      from: () => startOfMonth(new Date()),
      to: () => endOfToday(),
    },
  },
  {
    label: 'this_year',
    range: {
      from: () => startOfYear(new Date()),
      to: () => endOfToday(),
    },
  },
  {
    label: 'last_year',
    range: {
      from: () => startOfYear(subYears(new Date(), 1)),
      to: () => endOfYear(subYears(new Date(), 1)),
    },
  },
];

const RangePicker: React.FC<Props> = ({ dateRange, setDateRange }) => {
  const { t } = useTranslation(['transactions', 'common']);
  const [range, setRange] = useState<DateRange | undefined>(dateRange);
  const [selectedRange, setSelectedRange] = useState('all_dates');
  const [open, setOpen] = useState(false);

  const triggerPlaceholder = useMemo(() => {
    if (selectedRange) {
      return t(selectedRange);
    }

    if (range?.from && range?.to) {
      return `${format(new Date(range.from), 'MMM dd, yyyy')} - ${format(new Date(range.to), 'MMM dd, yyyy')}`;
    }
  }, [range?.from, range?.to, selectedRange, t]);

  const premadeRangeSelectHandler = (premadeRange: (typeof premadeDates)[number]) => {
    setSelectedRange(premadeRange.label);
    setRange({ from: premadeRange.range.from(), to: premadeRange.range.to() });
  };

  const closeHandler = () => {
    setRange(undefined);
    setOpen(false);
  };

  const applyHandler = () => {
    setDateRange(range);
    setOpen(false);
  };

  const handleDateSelect = (newRange: DateRange | undefined) => {
    if (!newRange) return;

    const newFrom = newRange?.from || Date.now();
    const newTo = newRange?.to || Date.now();

    const from = startOfDay(newFrom);
    const to = endOfDay(newTo);

    setRange({ from, to });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => setOpen(open)}
      side="bottom"
      align="end"
      sideOffset={20}
      trigger={
        <div className="flex justify-between items-center gap-4 text-body-s px-4 py-3.5 border border-gray-10 rounded-lg bg-white min-w-50">
          {triggerPlaceholder}
          <CalendarDateRangeIcon className="size-5 text-gray-50" />
        </div>
      }
    >
      <div className="bg-white grid grid-cols-[auto_1fr] rounded-lg border border-gray-5 shadow-[0_4px_6px_-2px_#10182808,_0_12px_16px_-4px_#10182814]">
        <div className="row-span-3 border-r-2 border-gray-5 flex flex-col min-w-45">
          {premadeDates.map((date) => (
            <button
              key={date.label}
              onClick={() => premadeRangeSelectHandler(date)}
              className="px-4 py-3 text-body-s flex justify-between border-b-2 border-gray-5 leading-6"
            >
              {t(date.label)}
              {selectedRange === date.label && <CheckCircleIcon className="size-6 text-success" />}
            </button>
          ))}
        </div>
        <DatePicker
          numberOfMonths={2}
          selected={range}
          onSelect={handleDateSelect}
          rootClassNames="border-b-2 border-gray-5"
        />
        <div className="p-4 flex justify-between">
          <div className="flex gap-3 items-center">
            <div className="h-full text-body-s text-center px-4 py-3.5 min-w-28 bg-gray-5 border border-gray-10 rounded-lg">
              {range?.from ? format(new Date(range.from), 'MMM dd, yyyy') : null}
            </div>
            -
            <div className="h-full text-body-s text-center px-4 py-3.5 min-w-28 bg-gray-5 border border-gray-10 rounded-lg">
              {range?.to ? format(new Date(range.to), 'MMM dd, yyyy') : null}
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={closeHandler}>{t('cancel', { ns: 'common' })}</Button>
            <Button onClick={applyHandler} primary>
              {t('apply')}
            </Button>
          </div>
        </div>
      </div>
    </Popover>
  );
};

export default RangePicker;

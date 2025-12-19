import React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import type { ChevronProps, DayPickerProps } from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { PropsRange } from 'react-day-picker';

type Props = {
  rootClassNames?: string;
} & DayPickerProps & Omit<PropsRange, 'mode'>;

const CustomChevron = ({ orientation }: ChevronProps) => {
  if (orientation === 'right') {
    return <ChevronRightIcon className="size-4 text-gray-50" />;
  }
  return <ChevronLeftIcon className="size-4 text-gray-50" />;
};

const DatePicker: React.FC<Props> = ({rootClassNames = '', ...props }) => {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      mode="range"
      showOutsideDays
      classNames={{
        root: `${defaultClassNames.root} ${rootClassNames} w-min`,
        months: `${defaultClassNames.months} flex relative w-min text-sm leading-5`,
        button_previous: `${defaultClassNames.button_previous} absolute size-6 flex items-center justify-center left-4 top-2`,
        button_next: `${defaultClassNames.button_next} absolute size-6 flex items-center justify-center right-4 top-2`,
        month_caption: `${defaultClassNames.month_caption} text-body-medium-s text-center leading-6`,
        month: `${defaultClassNames.month} px-4 py-2 border-r-2 border-gray-5 last:border-none`,
        month_grid: `${defaultClassNames.month_grid} mt-4 table-fixed`,
        weekday: `${defaultClassNames.weekday} font-normal! py-0.5 min-w-9 max-w-9 text-gray-60`,
        day: `${defaultClassNames.day} text-body-sm h-9 text-center`,
        outside: `${defaultClassNames.outside} text-gray-30`,
        range_start: `${defaultClassNames.range_start} [&.rdp-outside]:bg-sea-blue-disabled bg-sea-blue text-white rounded-lg`,
        range_end: `${defaultClassNames.range_end} [&.rdp-outside]:bg-sea-blue-disabled bg-sea-blue text-white rounded-lg`,
        range_middle: `${defaultClassNames.range_middle} bg-light-blue`,
      }}
      components={{
        Chevron: CustomChevron,
      }}
      {...props}
    />
  );
};

export default DatePicker;

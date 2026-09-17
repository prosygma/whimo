import React from 'react';
import Tooltip from '../uikit/Tooltip.tsx';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface Props {
  Icon: React.ElementType;
  summaryData: number;
  summaryTitle: string;
  description?: string;
}

const SummaryCard: React.FC<Props> = ({ Icon, summaryData, summaryTitle, description }) => {
  return (
    <div className="px-10 py-8 flex items-center gap-4 border-r-2 border-gray-5 last:border-r-none">
      <div className="bg-primary-subtle p-3 rounded-sm shrink-0">
        <Icon className="size-6 text-primary" />
      </div>
      <div>
        <p className="text-headline-2">{summaryData}</p>
        <div className="flex items-center gap-1 text-body-s text-gray-60">
          {summaryTitle}
          <Tooltip trigger={<InformationCircleIcon className="text-gray-40 size-4 cursor-pointer" />}>
            {description}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

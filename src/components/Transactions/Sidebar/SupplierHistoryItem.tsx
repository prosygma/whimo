import React from 'react';
import { format } from 'date-fns';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import TraceabilityStatus from '../../uikit/TraceabilityStatus.tsx';
import type { TraceabilityStatusEnum } from '../../../api/types/transactionTypes.ts';
import { useTranslation } from 'react-i18next';

interface Props {
  traceability: TraceabilityStatusEnum;
  traderId?: string;
  createdAt: string;
  volume: number;
  unit: string;
  fallThrough?: () => void;
}

const SupplierHistoryItem: React.FC<Props> = ({ traceability, traderId, createdAt, volume, unit, fallThrough }) => {
  const { t } = useTranslation(['transactions', 'common']);

  return (
    <div className="flex gap-3 items-start">
      <TraceabilityStatus traceability={traceability} icon />
      <p className="flex-1 text-body-s text-gray-60 min-w-0">
        <span className="block mb-0.5 text-body-medium-s text-gray-90 text-nowrap overflow-hidden text-ellipsis">
          {traderId
            ? t('history_transaction_trader_number', { trader_id: traderId })
            : t('history_transaction_trader_initial')}
        </span>
        {format(new Date(createdAt), 'MMM dd, yyyy hh:mm aaa')}
      </p>
      <p className="text-body-medium-s">{`${volume} ${unit}`}</p>
      <ArrowRightIcon
        className={`size-5 cursor-pointer text-gray-40 hover:text-gray-60 ${!traderId && 'hidden'}`}
        onClick={fallThrough}
      />
    </div>
  );
};

export default SupplierHistoryItem;

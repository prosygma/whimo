import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import SupplierHistoryItem from './SupplierHistoryItem.tsx';
import { useTranslation } from 'react-i18next';
import type { TransactionsResponse } from '../../../api/types/transactionTypes.ts';

interface Props {
  supplierHistory: TransactionsResponse;
  showViewAllHistoryButton: boolean;
  switchToSupplierHistory: () => void;
  fallThrough?: (buyerId: string, commodityGroupId: string) => void;
}

const TransactionsHistoryPreview: React.FC<Props> = ({
  supplierHistory,
  showViewAllHistoryButton,
  switchToSupplierHistory,
  fallThrough,
}) => {
  const { t } = useTranslation(['transactions', 'common']);

  return (
    <>
      <div className="[&&]:pt-6 [&&]:pb-3 [&&]:bg-transparent flex justify-between items-center text-body-medium-l">
        {t('supplier_history_title')}
        <ChevronRightIcon
          className="size-5 cursor-pointer  text-gray-40 hover:text-gray-60"
          onClick={switchToSupplierHistory}
        />
      </div>
      {supplierHistory &&
        supplierHistory.data.map((historyTransaction) => {
          const fallThroughHandler = () => {
            if (!fallThrough) return;

            fallThrough(historyTransaction.seller?.id, historyTransaction.commodity.group.id);
          };

          return (
            <SupplierHistoryItem
              key={historyTransaction.id}
              traceability={historyTransaction.traceability}
              traderId={historyTransaction.seller?.id}
              createdAt={historyTransaction.created_at}
              volume={historyTransaction.volume}
              unit={historyTransaction.commodity.unit}
              fallThrough={fallThroughHandler}
            />
          );
        })}
      {showViewAllHistoryButton && (
        <button
          onClick={switchToSupplierHistory}
          className="absolute bottom-0 w-full h-15 flex justify-center items-center outline-none bg-white text-button-m text-primary shadow-[0_-4px_12px_0_#1018280F]"
        >
          {t('view_all_history')}
        </button>
      )}
    </>
  );
};

export default TransactionsHistoryPreview;

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { TransactionItem } from '../../api/types/transactionTypes.ts';
import TransactionsTableRow from './TransactionsTableRow.tsx';
import type { PaginationResponse } from '../../api/types/common.ts';
import Pagination from '../Pagination.tsx';
import EmptyPlaceholder from '../EmptyPlaceholder.tsx';
import { InboxIcon } from '@heroicons/react/24/outline';

interface Props {
  transactionsList: TransactionItem[] | undefined;
  pagination: PaginationResponse | undefined;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  pageSwitchHandler: (page: number) => void;
}

const TransactionsTable: React.FC<Props> = ({ transactionsList, pagination, pageSwitchHandler, isSuccess }) => {
  const { t } = useTranslation(['transactions', 'common']);

  if (!transactionsList || !pagination) return;

  if (isSuccess && transactionsList.length === 0) {
    return (
      <EmptyPlaceholder Icon={InboxIcon} title={t('no_transactions_title')}>
        <Trans
          ns="transactions"
          i18nKey="no_transactions_description"
          components={[<p className="mt-3 mb-2.5" />, <p />]}
        />
      </EmptyPlaceholder>
    );
  }

  return (
    <>
      <table className="w-full [&_tr]:border-b-2 [&_tr]:border-gray-5 [&_tr>th]:text-left [&_th]:py-4 [&_td]:py-5 [&_th,&_td]:first:pl-10 [&_th,&_td]:px-4 [&_th,&_td]:last:pr-10">
        <thead>
          <tr className="uppercase text-gray-50">
            <th className="w-[17%] text-body-medium-xs">{t('transaction_type')}</th>
            <th className="w-[17%] text-body-medium-xs">{t('commodity_type', { ns: 'common' })}</th>
            <th className="w-[15%] text-body-medium-xs">{t('commodity_volume', { ns: 'common' })}</th>
            <th className="w-[21%] text-body-medium-xs">{t('date_time')}</th>
            <th className="w-[13%] text-body-medium-xs">{t('status')}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {transactionsList.map((transaction) => (
            <TransactionsTableRow key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </table>
      <Pagination paginationData={pagination} switchPage={pageSwitchHandler} />
    </>
  );
};

export default TransactionsTable;

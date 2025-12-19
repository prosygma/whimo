import React from 'react';
import type { BalanceGroupCommodityItem } from '../../api/types/balanceTypes.ts';
import { Trans, useTranslation } from 'react-i18next';
import EmptyPlaceholder from '../EmptyPlaceholder.tsx';
import BalanceTableRow from './BalanceTableRow.tsx';
import { InboxIcon } from '@heroicons/react/24/outline';

interface Props {
  commodityBalanceList: BalanceGroupCommodityItem[] | undefined;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const BalanceTable: React.FC<Props> = ({ commodityBalanceList, isSuccess }) => {
  const { t } = useTranslation(['balance', 'common']);

  if (!commodityBalanceList) return;

  if (isSuccess && commodityBalanceList.length === 0) {
    return (
      <EmptyPlaceholder Icon={InboxIcon} title={t('no_balance_title')}>
        <Trans
          ns="balance"
          i18nKey="no_balance_description"
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
            <th className="w-[20%] text-body-medium-xs">{t('commodity_code')}</th>
            <th className="text-body-medium-xs">{t('commodity_type', { ns: 'common' })}</th>
            <th className="w-[27%] text-body-medium-xs">{t('commodity_volume', { ns: 'common' })}</th>
          </tr>
        </thead>
        <tbody>
          {commodityBalanceList.map((commodity) => (
            <BalanceTableRow key={commodity.id} commodity={commodity} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BalanceTable;

import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader/PageHeader.tsx';
import { useTranslation } from 'react-i18next';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { BalanceResponse } from '../api/types/balanceTypes.ts';
import { fetchCommodityGroupBalance } from '../api/balance.ts';
import BalanceTable from '../components/Balance/BalanceTable.tsx';

const Balance: React.FC = () => {
  const { t } = useTranslation('balance');
  const [commodityGroupId, setCommodityGroupId] = useState<string>();

  const {
    data: commodityGroupResponse,
    isFetching,
    isSuccess,
    isError,
  } = useQuery<BalanceResponse>({
    queryKey: ['commodityGroups'],
    queryFn: () => fetchCommodityGroupBalance(),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess) {
      setCommodityGroupId(commodityGroupResponse?.data?.[0].id);
    }
  }, [commodityGroupResponse?.data, isSuccess]);

  const showCommodityChips = useMemo(() => {
    if (!isSuccess) {
      return false;
    }

    return commodityGroupResponse?.data?.length > 1;
  }, [commodityGroupResponse?.data?.length, isSuccess]);

  const commoditiesList = useMemo(() => {
    if (!commodityGroupResponse) return [];

    const commodityList = commodityGroupResponse.data.find((group) => group.id === commodityGroupId);
    if (!commodityList) return [];

    return commodityList.commodities.filter((commodity) => Boolean(commodity.balance));
  }, [commodityGroupId, commodityGroupResponse]);

  return (
    <>
      <PageHeader title={t('balance_page_header')} />
      {commodityGroupResponse?.data && showCommodityChips && (
        <div className="flex gap-6 bg-gray-5 px-10 pb-8">
          {commodityGroupResponse.data.map((commodityGroup) => (
            <div
              className={`p-3 text-body-medium-s capitalize border cursor-pointer rounded-lg ${commodityGroup.id === commodityGroupId ? 'bg-primary-subtle border-primary' : 'bg-white border-transparent shadow-[0_1px_2px_0_#1018280D]'}`}
              key={commodityGroup.id}
              onClick={() => setCommodityGroupId(commodityGroup.id)}
            >
              {commodityGroup.name}
            </div>
          ))}
        </div>
      )}
      <BalanceTable commodityBalanceList={commoditiesList} {...{ isSuccess, isError, isFetching }} />
    </>
  );
};

export default Balance;

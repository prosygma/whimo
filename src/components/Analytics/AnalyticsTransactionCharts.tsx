import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '../../api/transactions.ts';
import { getAnalyticsTransactionChartDatasets } from '../../helpers/getAnalyticsTransactionChartDatasets.ts';
import DoughnutChart from '../uikit/DoughnutChart.tsx';
import { useTranslation } from 'react-i18next';

const AnalyticsTransactionCharts: React.FC = () => {
  const { t } = useTranslation('analytics');

  const { data, isPending } = useQuery({
    queryKey: ['analyticsTransactionsChart'],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page_size', '1000');

      return fetchTransactions(params);
    },
  });

  const { traceabilityStatusChart, transactionStatusChart } = useMemo(() => {
    return getAnalyticsTransactionChartDatasets(data?.data);
  }, [data]);

  return (
    <div className="grid grid-cols-2 border-b-2 border-gray-5 [&>*]:border-r-2 [&>*]:border-gray-5 [&>*]:last:border-none">
      <div className="px-10 py-8 flex flex-col gap-6">
        <h6 className="text-body-medium-l">{t('traceability_chart_title')}</h6>
        <DoughnutChart
          height={228}
          loading={isPending}
          data={traceabilityStatusChart.dataset}
          legendGrid={{ columns: 2 }}
          doughnutConfig={{
            cutout: 91,
            borderRadius: 2,
            borderWidth: 2,
          }}
          wrapperClass="px-7.5"
          centerContent={
            <div className="text-center">
              <p className="text-body-medium-m">
                {traceabilityStatusChart.total}
                <span className="mt-1 text-body-xs text-gray-60 block w-min">{t('total_transactions')}</span>
              </p>
            </div>
          }
        />
      </div>
      <div className="px-10 py-8 flex flex-col gap-6">
        <h6 className="text-body-medium-l">{t('transactions_chart_title')}</h6>
        <DoughnutChart
          height={228}
          loading={isPending}
          data={transactionStatusChart.dataset}
          legendGrid={{ columns: 2 }}
          doughnutConfig={{
            cutout: 91,
            borderRadius: 2,
            borderWidth: 2,
          }}
          wrapperClass="px-7.5"
          centerContent={
            <div className="text-center">
              <p className="text-body-medium-m">
                {transactionStatusChart.total}
                <span className="mt-1 text-body-xs text-gray-60 block w-min">{t('total_transactions')}</span>
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default AnalyticsTransactionCharts;

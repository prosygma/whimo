import type { TraceabilityStatusEnum, TransactionItem } from '../api/types/transactionTypes.ts';
import type { DoughnutChartData } from '../components/uikit/DoughnutChart.tsx';
import i18n from '../i18n.ts';
import {
  traceabilityChartColors,
  transactionStatusChartColors,
  type TransactionsStatusEnum,
} from '../constants/chartColors.ts';

type GetAnalyticsTransactionChartDatasets = (transactions?: TransactionItem[]) => {
  transactionStatusChart: { total: number; dataset: DoughnutChartData };
  traceabilityStatusChart: { total: number; dataset: DoughnutChartData };
};

export const getAnalyticsTransactionChartDatasets: GetAnalyticsTransactionChartDatasets = (transactions) => {
  const traceabilityLabels: string[] = [];
  const transactionStatusLabels: string[] = [];
  let traceabilityTotal = 0;
  let transactionStatusTotal = 0;

  const traceabilityDataset: { data: number[]; backgroundColor: string[] } = {
    data: [],
    backgroundColor: [],
  };
  const transactionStatusDataset: { data: number[]; backgroundColor: string[] } = {
    data: [],
    backgroundColor: [],
  };

  if (transactions) {
    const accumulatedData = transactions.reduce<Record<string, number>>((acc, transactionItem) => {
      const traceability = transactionItem.traceability;
      let status: TransactionsStatusEnum = transactionItem.status;

      if (transactionItem?.is_automatic) {
        status = 'is_automatic';
      } else if (transactionItem?.is_automatic === undefined) {
        status = 'recorded';
      }

      if (!acc[traceability]) {
        acc[traceability] = 0;
      }
      if (!acc[status]) {
        acc[status] = 0;
      }

      return { ...acc, [traceability]: acc[traceability] + 1, [status]: acc[status] + 1 };
    }, {});

    for (const key in traceabilityChartColors) {
      const count = accumulatedData[key];

      if (!count || count === 0) continue;

      traceabilityLabels.push(i18n.t(key, { ns: 'common' }));
      traceabilityDataset.data.push(count);
      traceabilityDataset.backgroundColor.push(traceabilityChartColors[key as TraceabilityStatusEnum]);
      traceabilityTotal += count;
    }

    for (const key in transactionStatusChartColors) {
      const count = accumulatedData[key];

      if (!count || count === 0) continue;

      transactionStatusLabels.push(i18n.t(key, {  ns: 'common' }));
      transactionStatusDataset.data.push(count);
      transactionStatusDataset.backgroundColor.push(transactionStatusChartColors[key as TransactionsStatusEnum]);
      transactionStatusTotal += count;
    }
  }

  return {
    traceabilityStatusChart: {
      dataset: { labels: traceabilityLabels, datasets: [traceabilityDataset] },
      total: traceabilityTotal,
    },
    transactionStatusChart: {
      dataset: { labels: transactionStatusLabels, datasets: [transactionStatusDataset] },
      total: transactionStatusTotal,
    },
  };
};

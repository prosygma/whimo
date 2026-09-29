import type { TraceabilityStatusEnum, TransactionItem, TransactionStatusEnum } from '../api/types/transactionTypes.ts';
import type { DoughnutChartData } from '../components/uikit/DoughnutChart.tsx';
import i18n from '../i18n.ts';

type GetAnalyticsTransactionChartDatasets = (transactions?: TransactionItem[]) => {
  transactionStatusChart: { total: number; dataset: DoughnutChartData };
  traceabilityStatusChart: { total: number; dataset: DoughnutChartData };
};

type TransactionsStatusEnum = TransactionStatusEnum | 'is_automatic' | 'recorded';

const traceabilityReference: Record<TraceabilityStatusEnum, Record<string, string>> = {
  full: { color: '#29C229' },
  conditional: { color: '#298FC2' },
  partial: { color: '#901F82' },
  incomplete: { color: '#002746' },
};

const transactionStatusReference: Record<TransactionsStatusEnum, Record<string, string>> = {
  accepted: { color: '#29C229' },
  pending: { color: '#E19C3B' },
  rejected: { color: '#C22929' },
  no_response: { color: '#808080' },
  is_automatic: { color: '#1A1A1A' },
  recorded: { color: '#003964' },
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

    for (const key in traceabilityReference) {
      const count = accumulatedData[key];

      if (!count || count === 0) continue;

      traceabilityLabels.push(i18n.t(key, { ns: 'common' }));
      traceabilityDataset.data.push(count);
      traceabilityDataset.backgroundColor.push(traceabilityReference[key as TraceabilityStatusEnum].color);
      traceabilityTotal += count;
    }

    for (const key in transactionStatusReference) {
      const count = accumulatedData[key];

      if (!count || count === 0) continue;

      transactionStatusLabels.push(i18n.t(key, {  ns: 'common' }));
      transactionStatusDataset.data.push(count);
      transactionStatusDataset.backgroundColor.push(transactionStatusReference[key as TransactionsStatusEnum].color);
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

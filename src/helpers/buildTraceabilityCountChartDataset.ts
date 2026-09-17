import type { TraceabilityCountsResponsePayload, TraceabilityStatusEnum } from '../api/types/transactionTypes.ts';
import i18n from '../i18n.ts';
import { traceabilityChartColors } from '../constants/chartColors.ts';

export const buildTraceabilityCountChartDataset = (data?: TraceabilityCountsResponsePayload) => {
  let total = 0;
  const labels: string[] = [];
  const dataset: { data: number[]; backgroundColor: string[] } = {
    data: [],
    backgroundColor: [],
  };

  if (data) {
    for (const key in data.counts) {
      const count = data.counts[key as TraceabilityStatusEnum];

      if (!count || count === 0) continue;

      labels.push(i18n.t(key, { context: 'short', ns: 'common' }));
      dataset.data.push(count);
      dataset.backgroundColor.push(traceabilityChartColors[key as TraceabilityStatusEnum]);
      total += count;
    }
  }

  return { chartData: { labels, datasets: [dataset] }, total };
};

import type { TraceabilityCountsResponsePayload, TraceabilityStatusEnum } from '../api/types/transactionTypes.ts';
import i18n from '../i18n.ts';

const countsReference: Record<TraceabilityStatusEnum, Record<string, string>> = {
  full: { color: '#29C229' },
  conditional: { color: '#298FC2' },
  partial: { color: '#901F82' },
  incomplete: { color: '#002746' },
};

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
      dataset.backgroundColor.push(countsReference[key as TraceabilityStatusEnum].color);
      total += count;
    }
  }

  return { chartData: { labels, datasets: [dataset] }, total };
};

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface LegendGrid {
  columns?: number;
}

interface DoughnutConfig {
  cutout?: string | number;
  radius?: string | number;
  borderRadius?: number;
  borderWidth?: number;
}

interface Props {
  data: DoughnutChartData;
  options?: ChartOptions<'doughnut'>;
  legendGrid?: LegendGrid;
  doughnutConfig?: DoughnutConfig;
  centerContent?: React.ReactNode;
  height?: number | string;
  wrapperClass?: string;
  loading?: boolean;
}

const DoughnutChart: React.FC<Props> = ({
  data,
  options,
  legendGrid = { columns: 2 },
  doughnutConfig,
  centerContent,
  height,
  wrapperClass,
  loading = false,
}) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: doughnutConfig?.cutout,
    radius: doughnutConfig?.radius,
    layout: {
      padding: 0,
    },
    interaction: {
      mode: undefined,
    },
    hover: {
      mode: null as unknown as undefined,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: legendGrid.columns ? `repeat(${legendGrid.columns}, 1fr)` : 'repeat(2, 1fr)',
    gap: '12px',
    flex: 1,
  };

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      ...(doughnutConfig?.borderRadius && { borderRadius: doughnutConfig.borderRadius }),
      ...(doughnutConfig?.borderWidth !== undefined && { borderWidth: doughnutConfig.borderWidth }),
      offset: 0,
      hoverOffset: 0,
      hoverBackgroundColor: dataset.backgroundColor,
      hoverBorderColor: dataset.borderColor,
    })),
  };

  const chartContainerStyle: React.CSSProperties = {
    aspectRatio: '1/1',
    maxWidth: '100%',
    maxHeight: '100%',
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  if (loading) return <div className={`shimmer w-full h-full rounded-lg ${wrapperClass}`} />;

  return (
    <div className={`flex items-center gap-6 ${wrapperClass}`}>
      <div className="flex-shrink-0 relative" style={chartContainerStyle}>
        <Doughnut data={chartData} options={options || defaultOptions} />
        {centerContent && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {centerContent}
          </div>
        )}
      </div>
      <div style={gridStyle}>
        {data.labels.map((label, index) => (
          <div key={index} className="flex items-start gap-1.5">
            <div
              className="mt-1 size-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: data.datasets[0]?.backgroundColor?.[index] || '#ccc',
              }}
            />
            <p className="text-body-xs text-gray-60">
              <span className="block text-body-medium-xs text-gray-90">{data.datasets[0]?.data[index]}</span>
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;

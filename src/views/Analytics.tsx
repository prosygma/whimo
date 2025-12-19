import React from 'react';
import PageHeader from '../components/PageHeader/PageHeader.tsx';
import { useTranslation } from 'react-i18next';
import SummaryCardsBlock from '../components/Analytics/SummaryCardsBlock.tsx';
import AnalyticsTransactionCharts from '../components/Analytics/AnalyticsTransactionCharts.tsx';

const Analytics: React.FC = () => {
  const { t } = useTranslation('analytics');

  return (
    <>
      <PageHeader title={t('analytics_page_header')} />
      <SummaryCardsBlock />
      <AnalyticsTransactionCharts />
    </>
  );
};

export default Analytics;

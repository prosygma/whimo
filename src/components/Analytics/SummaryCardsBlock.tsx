import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalyticsSummary } from '../../api/analytics.ts';
import { useTranslation } from 'react-i18next';
import SummaryCard from './SummaryCard.tsx';
import { FolderIcon, MapPinIcon, Squares2X2Icon, UserGroupIcon } from '@heroicons/react/24/outline';

const SummaryCardsBlock: React.FC = () => {
  const { t } = useTranslation('analytics');

  const { data: analyticsSummary } = useQuery({
    queryKey: ['analyticsSummary'],
    queryFn: fetchAnalyticsSummary,
  });

  if (!analyticsSummary?.data) return null;

  return (
    <div className="grid grid-cols-4 border-b-2 border-gray-5">
      <SummaryCard
        Icon={Squares2X2Icon}
        summaryData={analyticsSummary.data.total_transactions}
        summaryTitle={t('summary_card_total_transactions')}
        description={t('summary_card_total_transactions_description')}
      />
      <SummaryCard
        Icon={UserGroupIcon}
        summaryData={analyticsSummary.data.total_suppliers}
        summaryTitle={t('summary_card_total_suppliers')}
        description={t('summary_card_total_suppliers_description')}
      />
      <SummaryCard
        Icon={MapPinIcon}
        summaryData={analyticsSummary.data.initial_plots}
        summaryTitle={t('summary_card_initial_plots')}
        description={t('summary_card_initial_plots_description')}
      />
      <SummaryCard
        Icon={FolderIcon}
        summaryData={analyticsSummary.data.files_uploaded}
        summaryTitle={t('summary_card_files_uploaded')}
        description={t('summary_card_files_uploaded_description')}
      />
    </div>
  );
};

export default SummaryCardsBlock;

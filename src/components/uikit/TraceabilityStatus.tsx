import React from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionTraceabilityEnum } from '../../api/schemas/transactionSchema';
import { cva } from 'class-variance-authority';

interface Props {
  traceability?: (typeof TransactionTraceabilityEnum)[number];
  icon?: boolean;
}

const badgeVariants = cva('w-min text-nowrap px-2 py-1 rounded-sm text-body-medium-s', {
  variants: {
    traceability: {
      full: 'text-success bg-[#EAF9EA]',
      conditional: 'text-sea-blue bg-[#EAF4F9]',
      partial: 'text-mulberry-purple bg-[#F4E9F2]',
      incomplete: 'text-midnight-blue bg-[#E5E9EC]',
    },
    icon: {
      true: '[&]:size-6 [&]:p-0 bg-white border border-gray-10 rounded-sm flex relative after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:block after:w-3.5 after:h-2.5 after:mask-[url(/public/traceability_mask.svg)] shadow-[0_1px_2px_0_#1018280D]',
    },
  },
  compoundVariants: [
    { traceability: undefined, class: 'text-gray-50 bg-gray-10' },
    { traceability: null, class: 'text-gray-50 bg-gray-10' },
    { traceability: 'full', icon: true, class: 'after:bg-success' },
    { traceability: 'conditional', icon: true, class: 'after:bg-sea-blue' },
    { traceability: 'partial', icon: true, class: 'after:bg-mulberry-purple' },
    { traceability: 'incomplete', icon: true, class: 'after:bg-midnight-blue' },
  ],
});

const TraceabilityStatus: React.FC<Props> = ({ traceability, icon = false }) => {
  const { t } = useTranslation('common');

  return (
    <div className={badgeVariants({ traceability, icon })}>
      {icon ? null : traceability ? t(traceability) : t('traceability_unavailable')}
    </div>
  );
};

export default TraceabilityStatus;

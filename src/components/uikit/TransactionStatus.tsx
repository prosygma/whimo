import React from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionStatusEnum } from '../../api/schemas/transactionSchema';
import { cva } from 'class-variance-authority';

interface Props {
  status: (typeof TransactionStatusEnum)[number];
  automatic?: boolean | 'recorded';
}

const badgeVariants = cva('w-min text-nowrap px-2 py-1 rounded-sm text-body-medium-s', {
  variants: {
    status: {
      accepted: 'text-success bg-light-green',
      pending: 'text-warning bg-light-orange',
      rejected: 'text-error bg-light-red',
      no_response: 'text-gray-50 bg-gray-5',
    },
    automatic: {
      true: '[&]:text-gray-90 [&]:bg-gray-10',
      recorded: '[&]:text-primary-active [&]:bg-primary-subtle',
    },
  },
});

const TransactionStatus: React.FC<Props> = ({ status, automatic = 'recorded' }) => {
  const { t } = useTranslation('common');

  let badgeText = t(status);

  if (automatic === undefined) {
    badgeText = t('recorded');
  }
  if (automatic) {
    badgeText = t('is_automatic');
  }

  return <div className={badgeVariants({ status, automatic })}>{badgeText}</div>;
};

export default TransactionStatus;

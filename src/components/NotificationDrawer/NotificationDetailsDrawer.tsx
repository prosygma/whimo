import React from 'react';
import SideDrawer from '../uikit/SideDrawer.tsx';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import TransactionDetails from '../Transactions/Sidebar/TransactionDetails.tsx';
import type { TransactionItem } from '../../api/types/transactionTypes.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction?: TransactionItem;
}

const NotificationDetailsDrawer: React.FC<Props> = ({ isOpen, onClose, transaction }) => {
  const { t } = useTranslation(['notifications', 'common']);

  return (
    <SideDrawer isOpen={isOpen} align="left" onClose={onClose} scrollable withBackdrop={false}>
      <SideDrawer.SideDrawerHeader title={t('transaction_details')} className="[&&]:py-6" goBack={onClose}>
        <XMarkIcon className="size-6 cursor-pointer hover:text-gray-70" onClick={onClose} />
      </SideDrawer.SideDrawerHeader>
      {!transaction ? null : <TransactionDetails transaction={transaction} />}
    </SideDrawer>
  );
};

export default NotificationDetailsDrawer;

import React, { useState } from 'react';
import type { TransactionItem } from '../../api/types/transactionTypes.ts';
import { Trans, useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import TransactionStatus from '../uikit/TransactionStatus.tsx';
import {
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from '@heroicons/react/24/outline';
import Tooltip from '../uikit/Tooltip.tsx';
import TransactionSidebar from './Sidebar/TransactionSidebar.tsx';
import DownloadTypeSelectionModal from './Modals/DownloadTypeSelectionModal.tsx';
import DownloadDetailsModal from './Modals/DownloadDetailsModal.tsx';
import DownloadLocationsModal from './Modals/DownloadLocationsModal.tsx';

interface Props {
  transaction: TransactionItem;
}

export type TransactionDownloadModalType = 'typeSelection' | 'details' | 'geolocation';

const TransactionsTableRow: React.FC<Props> = ({ transaction }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const [downloadModalTypeOpen, setDownloadModalTypeOpen] = useState<TransactionDownloadModalType | null>(null);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const transactionDataDownloadHandler = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    event.stopPropagation();
    setDownloadModalTypeOpen('typeSelection');
  };

  const onModalClose = () => {
    setDownloadModalTypeOpen(null);
  };

  const showDownloadIcon =
    transaction.status === 'accepted' &&
    'is_automatic' in transaction &&
    transaction.is_automatic === false;

  return (
    <>
      <DownloadTypeSelectionModal
        isOpen={downloadModalTypeOpen === 'typeSelection'}
        onClose={onModalClose}
        selectDownloadType={setDownloadModalTypeOpen}
      />
      <DownloadDetailsModal
        transactionId={transaction.id}
        isOpen={downloadModalTypeOpen === 'details'}
        onClose={onModalClose}
        onCancel={() => setDownloadModalTypeOpen('typeSelection')}
      />
      <DownloadLocationsModal
        transactionId={transaction.id}
        isOpen={downloadModalTypeOpen === 'geolocation'}
        onClose={onModalClose}
        onCancel={() => setDownloadModalTypeOpen('typeSelection')}
      />
      <tr className="cursor-pointer hover:bg-gray-5" onClick={() => setSideBarOpen(true)}>
        <td>
          <div className="flex items-center gap-2">
            {transaction.action === 'selling' ? (
              <ArrowUpCircleIcon className="size-6 text-gray-50" />
            ) : (
              <ArrowDownCircleIcon className="size-6 text-gray-50" />
            )}
            <p>{t(transaction.action)}</p>
          </div>
        </td>
        <td>{transaction.commodity.group.name}</td>
        <td>{`${transaction.volume} ${transaction.commodity.unit}`}</td>
        <td>{format(new Date(transaction.created_at), 'MMM dd, yyyy hh:mm aaa')}</td>
        <td>
          <TransactionStatus automatic={transaction?.is_automatic} status={transaction.status} />
        </td>
        <td>
          <div className="flex items-center justify-end gap-4">
            {transaction.is_automatic && (
              <Tooltip trigger={<ExclamationTriangleIcon className="size-6 cursor-pointer text-warning" />}>
                <Trans
                  ns="transactions"
                  i18nKey="automatic_transaction_tooltip"
                  components={[<p className="mb-2" />, <p />]}
                />
              </Tooltip>
            )}
            {showDownloadIcon && (
              <ArrowDownTrayIcon
                className="size-6 cursor-pointer text-gray-50 hover:text-gray-70"
                onClick={transactionDataDownloadHandler}
              />
            )}
            <EyeIcon
              className="size-6 cursor-pointer text-gray-50 hover:text-gray-70"
              onClick={() => {
                setSideBarOpen(true);
              }}
            />
          </div>
        </td>
      </tr>
      <TransactionSidebar
        isOpen={sideBarOpen}
        onClose={() => setSideBarOpen(false)}
        transaction={transaction}
        transactionDataDownloadHandler={transactionDataDownloadHandler}
      />
    </>
  );
};

export default TransactionsTableRow;

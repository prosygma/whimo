import React, { useEffect, useState } from 'react';
import Modal from '../../uikit/Modal.tsx';
import Button from '../../uikit/Button.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { downloadCsv } from '../../../api/transactions.ts';
import { triggerFileDownload } from '../../../helpers/triggerFileDownload.ts';

type Details = {
  transactionsQty?: number;
};

interface Props {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

const DownloadDetailsModal: React.FC<Props> = ({ transactionId, isOpen, onClose, onCancel }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const [headerData, setHeaderData] = useState<Details>({});

  const {
    data: response,
    status,
    isPending,
  } = useQuery({
    queryKey: ['downloadTransactionDetails', transactionId],
    queryFn: () => downloadCsv(transactionId),
    enabled: isOpen,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (status !== 'success' || !response?.headers) {
      setHeaderData({});
      return;
    }

    setHeaderData((prevState) => ({
      ...prevState,
      transactionsQty: parseInt(response.headers['x-total-transactions']),
    }));
  }, [response?.data, response?.headers, status]);

  const handleDownload = () => {
    if (!response?.data) return;
    triggerFileDownload(response.data, `transaction_${transactionId}_chain.csv`);

    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('download_transaction_details_header')} onClose={onClose} />
      <Modal.ModalBody>
        <p className="text-body-m text-gray-60">
          <Trans
            ns="transactions"
            i18nKey={'download_transaction_details_description'}
            values={{ count: headerData?.transactionsQty, context: isPending ? 'loading' : '' }}
            components={{
              wrapper: <span className="text-nowrap" />,
              shimmer: <span className="inline-block shimmer rounded-sm h-5.5 w-6 mb-[-6px]" />,
            }}
          />
        </p>
      </Modal.ModalBody>
      <Modal.ModalFooter className="grid gap-3 grid-cols-2">
        <Button onClick={onCancel}>{t('cancel', { ns: 'common' })}</Button>
        <Button primary onClick={handleDownload} disabled={isPending}>
          {t('download')}
        </Button>
      </Modal.ModalFooter>
    </Modal>
  );
};

export default DownloadDetailsModal;

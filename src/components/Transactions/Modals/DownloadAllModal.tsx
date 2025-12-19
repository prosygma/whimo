import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import Button from '../../uikit/Button.tsx';
import { useMutation } from '@tanstack/react-query';
import { downloadAll } from '../../../api/transactions.ts';
import { triggerFileDownload } from '../../../helpers/triggerFileDownload.ts';
import handleError from '../../../helpers/handleError.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  count?: number;
  params: URLSearchParams;
}

const DownloadAllModal: React.FC<Props> = ({ isOpen, onClose, count, params }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const { mutate: downloadFile } = useMutation({
    mutationKey: ['downloadAll', params],
    mutationFn: () => downloadAll(params),
    retry: false,
    onSuccess: (response) => {
      triggerFileDownload(response.data, `transactions_all_bundle.csv`);

      onClose();
    },
    onError: handleError,
  });

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('download_all_transactions_modal_header')} onClose={onClose} />
      <Modal.ModalBody>
        <p className="text-gray-60">{t('download_all_transactions_modal_description', { count })}</p>
      </Modal.ModalBody>
      <Modal.ModalFooter className="grid gap-3 grid-cols-2">
        <Button onClick={onClose}>{t('cancel', { ns: 'common' })}</Button>
        <Button primary onClick={() => downloadFile()}>
          {t('download')}
        </Button>
      </Modal.ModalFooter>
    </Modal>
  );
};

export default DownloadAllModal;

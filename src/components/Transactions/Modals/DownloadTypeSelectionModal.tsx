import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import Button from '../../uikit/Button.tsx';
import { ListBulletIcon, MapPinIcon } from '@heroicons/react/24/outline';
import type { TransactionDownloadModalType } from '../TransactionsTableRow.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectDownloadType: (type: TransactionDownloadModalType) => void;
}

const DownloadTypeSelectionModal: React.FC<Props> = ({ isOpen, onClose, selectDownloadType }) => {
  const { t } = useTranslation(['transactions', 'common']);

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('download_transaction_modal_header')} onClose={onClose} />
      <Modal.ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-body-m text-gray-60">{t('download_transaction_modal_description')}</p>
          <Button overrideIconStyle="text-gray-50" Icon={ListBulletIcon} onClick={() => selectDownloadType('details')}>
            {t('download_transaction_details')}
          </Button>
          <Button overrideIconStyle="text-gray-50" Icon={MapPinIcon} onClick={() => selectDownloadType('geolocation')}>
            {t('download_farm_geolocation')}
          </Button>
        </div>
      </Modal.ModalBody>
    </Modal>
  );
};

export default DownloadTypeSelectionModal;

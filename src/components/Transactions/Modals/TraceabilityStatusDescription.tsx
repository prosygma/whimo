import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import TraceabilityStatus from '../../uikit/TraceabilityStatus.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TraceabilityStatusDescription: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['transactions', 'common']);

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('traceability_status_info_modal_title')} onClose={onClose} />
      <Modal.ModalBody>
        <p className="[&&]:py-4 text-body-s text-gray-60">{t('traceability_status_info_modal_description')}</p>
        <div className="[&&]:py-4 flex flex-col gap-2">
          <TraceabilityStatus traceability="full" />
          <p className="text-body-s text-gray-60">{t('traceability_status_full_description')}</p>
        </div>
        <div className="[&&]:py-4 flex flex-col gap-2">
          <TraceabilityStatus traceability="conditional" />
          <p className="text-body-s text-gray-60">{t('traceability_status_conditional_description')}</p>
        </div>
        <div className="[&&]:py-4 flex flex-col gap-2">
          <TraceabilityStatus traceability="partial" />
          <p className="text-body-s text-gray-60">{t('traceability_status_partial_description')}</p>
        </div>
        <div className="[&&]:py-4 flex flex-col gap-2">
          <TraceabilityStatus traceability="incomplete" />
          <p className="text-body-s text-gray-60">{t('traceability_status_incomplete_description')}</p>
        </div>
      </Modal.ModalBody>
    </Modal>
  );
};

export default TraceabilityStatusDescription;

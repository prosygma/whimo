import React from 'react';
import Modal from '../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import Button from '../uikit/Button.tsx';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { OtpModes } from '../../views/Registration.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setMode: (value: OtpModes) => void;
}

const OtpModeSelectionModal: React.FC<Props> = ({ isOpen, onClose, setMode }) => {
  const { t } = useTranslation(['registration', 'common']);

  const modeSelectHandler = (mode: OtpModes) => {
    setMode(mode);
    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('verification_mode_select_title')} onClose={onClose} />
      <Modal.ModalBody>
        <div className="flex flex-col gap-4">
          <p className="text-gray-60">{t('verification_mode_select_message')}</p>
          <Button Icon={EnvelopeIcon} onClick={() => modeSelectHandler('email')}>
            {t('verification_mode_email')}
          </Button>
          <Button Icon={PhoneIcon} onClick={() => modeSelectHandler('phone')}>
            {t('verification_mode_phone')}
          </Button>
        </div>
      </Modal.ModalBody>
    </Modal>
  );
};

export default OtpModeSelectionModal;

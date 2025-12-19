import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import Button from '../../uikit/Button.tsx';
import { useTokens } from '../../../hooks/useTokens.ts';
import { useNavigate } from 'react-router';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LogoutModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['settings', 'common']);
  const navigate = useNavigate();

  const { logout } = useTokens();

  const logoutUser = () => {
    logout();
    navigate('/');
  };

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader onClose={onClose} title={t('logout_modal_title')} />
      <Modal.ModalBody>
        <p className="text-gray-60">{t('logout_modal_message')}</p>
      </Modal.ModalBody>
      <Modal.ModalFooter className="grid grid-cols-2 gap-3">
        <Button onClick={onClose}>{t('cancel', { ns: 'common' })}</Button>
        <Button primary onClick={logoutUser}>
          {t('logout')}
        </Button>
      </Modal.ModalFooter>
    </Modal>
  );
};

export default LogoutModal;

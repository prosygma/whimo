import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../uikit/Modal.tsx';
import Button from '../../uikit/Button.tsx';
import { useMutation } from '@tanstack/react-query';
import { useTokens } from '../../../hooks/useTokens.ts';
import { deleteAccount } from '../../../api/user.ts';
import { useNavigate } from 'react-router';
import handleError from '../../../helpers/handleError.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['settings', 'common']);
  const { logout } = useTokens();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout();
      navigate('/');
    },
    onError: handleError,
  });

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader onClose={onClose} title={t('delete_account_modal_title')} />
      <Modal.ModalBody>
        <p className="text-gray-60">{t('delete_account_modal_message')}</p>
      </Modal.ModalBody>
      <Modal.ModalFooter className="grid grid-cols-2 gap-3">
        <Button onClick={onClose}>{t('cancel', { ns: 'common' })}</Button>
        <Button primary destroy onClick={() => mutate()}>
          {t('delete')}
        </Button>
      </Modal.ModalFooter>
    </Modal>
  );
};

export default DeleteAccountModal;

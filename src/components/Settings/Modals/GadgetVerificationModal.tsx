import React, { useEffect, useState } from 'react';
import Modal from '../../uikit/Modal.tsx';
import { Trans, useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import type { VerificationType } from '../Info.tsx';
import Button from '../../uikit/Button.tsx';
import { useMutation } from '@tanstack/react-query';
import { sendVerificationCode, verifyGadget } from '../../../api/user.ts';
import handleError from '../../../helpers/handleError.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: VerificationType;
  identifier: string;
  onSuccess: () => void;
}

const GadgetVerificationModal: React.FC<Props> = ({ isOpen, onClose, type, identifier, onSuccess }) => {
  const { t } = useTranslation(['settings', 'common']);
  const [code, setCode] = useState<string>('');

  const { mutate: sendCode, isSuccess } = useMutation({
    mutationKey: ['sendVerificationCode', type, identifier],
    mutationFn: () => sendVerificationCode(identifier),
    onError: handleError,
  });

  useEffect(() => {
    if (!isOpen || isSuccess) return;

    sendCode();
  }, [isOpen, isSuccess, sendCode]);

  const { mutate: verify, isPending: verificationRequestPending } = useMutation({
    mutationKey: ['verifyGadget', identifier],
    mutationFn: () => verifyGadget(code, identifier),
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: handleError,
  });

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader onClose={onClose} title={t('gadget_verification_modal_title', { context: type })} />
      <Modal.ModalBody>
        <div className="flex flex-col gap-6">
          <p className="text-body-m gray-60">{t('otp_common_description', { ns: 'common' })}</p>
          <OtpInput
            value={code}
            onChange={setCode}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            skipDefaultStyles
            containerStyle="grid grid-cols-6 gap-1.5"
            inputStyle="size-15 text-headline-2 outline-none border border-gray-10 rounded-lg text-center"
          />
        </div>
      </Modal.ModalBody>
      <Modal.ModalFooter className="flex flex-col gap-3">
        <Button primary disabled={verificationRequestPending} onClick={() => verify()}>
          {t('confirm', { ns: 'common' })}
        </Button>
        <Trans
          ns="common"
          i18nKey="didnt_receive_the_code"
          components={{
            wrap: <p className="text-center" />,
            btn: (
              <Button primary ghost className="inline" onClick={() => sendCode()}>
                {''}
              </Button>
            ),
          }}
        />
      </Modal.ModalFooter>
    </Modal>
  );
};

export default GadgetVerificationModal;

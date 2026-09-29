import React, { useState } from 'react';
import Input from '../uikit/Input.tsx';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Button from '../uikit/Button.tsx';
import { useTranslation } from 'react-i18next';
import type { OtpModes } from '../../views/Registration.tsx';
import PhoneInput from '../uikit/PhoneInput.tsx';

interface Props {
  mode: OtpModes;
  onContinue: (identifier: string, mode: OtpModes) => void;
  setMode: () => void;
}

const ForgotPasswordForm: React.FC<Props> = ({ onContinue, mode, setMode }) => {
  const { t } = useTranslation(['forgot_password', 'common']);
  const [identifier, setIdentifier] = useState<string>('');

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIdentifier(event.target.value);
  };

  const submitHandler = (event: React.SyntheticEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    onContinue(identifier, 'email');
  };

  return (
    <>
      <div>
        <h1 className="text-headline-1 mb-2">{t('forgot_password_header')}</h1>
        <p className="text-body-m text-gray-60">{t('forgot_password_description')}</p>
      </div>
      <form id="forgotPasswordForm">
        {mode === 'email' ? (
          <Input
            label={t('email', { ns: 'common' })}
            placeholder={t('email_placeholder', { ns: 'common' })}
            StartIcon={EnvelopeIcon}
            value={identifier}
            onChange={changeHandler}
          />
        ) : (
          <PhoneInput
            label={t('phone', { ns: 'common' })}
            value={identifier}
            onChange={(value) => setIdentifier(value ?? '')}
          />
        )}
      </form>
      <Button primary onClick={submitHandler}>
        {t('send_code')}
      </Button>
      <Button primary ghost className="inline" onClick={setMode}>
        {mode === 'email' ? t('continue_with_phone', { ns: 'common' }) : t('continue_with_email', { ns: 'common' })}
      </Button>
    </>
  );
};

export default ForgotPasswordForm;

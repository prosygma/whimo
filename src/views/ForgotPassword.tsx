import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/uikit/Button.tsx';
import { useNavigate } from 'react-router';
import type { OtpModes } from './Registration.tsx';
import ForgotPasswordForm from '../components/ForgotPassword/ForgotPasswordForm.tsx';
import type { OtpChannel } from '../api/types/registrationTypes.ts';
import OtpScreen from '../components/Registration/OtpScreen.tsx';
import { useMutation } from '@tanstack/react-query';
import { passwordResetSendOtp, passwordResetSetNewPassword, passwordResetVerifyOtp } from '../api/user.ts';
import NewPasswordForm from '../components/ForgotPassword/NewPasswordForm.tsx';
import handleError from '../helpers/handleError.ts';

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation(['forgot_password', 'common']);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [otpMode, setOtpMode] = useState<OtpModes>('email');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpChannel, setOtpChannel] = useState<OtpChannel>();
  const [showNewPasswordScreen, setShowNewPasswordScreen] = useState(false);


  const backToLoginHandler = () => {
    navigate('/login');
  };

  const { mutate: onOtpCodeSubmit, isPending: codeSubmitPending } = useMutation({
    mutationKey: ['otp_code_submit'],
    mutationFn: passwordResetVerifyOtp,
    onSuccess: (_, variables) => {
      setShowOtpScreen(false);
      setShowNewPasswordScreen(true);
      setCode(variables.code);
    },
    onError: handleError,
  });

  const { mutate: onNewPasswordSubmit, isPending: newPasswordSubmitPending } = useMutation({
    mutationKey: ['new_password_submit'],
    mutationFn: passwordResetSetNewPassword,
    onSuccess: () => {
      navigate('/');
    },
    onError: handleError,
  });

  const onIdentifierFillProceed = async (identifier: string, mode: OtpModes) => {
    setShowOtpScreen(true);
    setIdentifier(identifier);
    setOtpMode(mode);
    setOtpChannel(await passwordResetSendOtp({ identifier }));
  };

  const onNewPasswordFillProceed = (password: string) => {
    onNewPasswordSubmit({ identifier, code, password });
  };

  if (showOtpScreen && identifier) {
    return (
      <OtpScreen
        mode={otpMode}
        channel={otpChannel}
        identifier={identifier}
        onContinue={(data) => onOtpCodeSubmit(data)}
        disableSubmit={codeSubmitPending}
      />
    );
  }

  const switchOtpMode = () => {
    if (otpMode === 'email') {
      setOtpMode('phone');
      return;
    }
    setOtpMode('email');
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-8 w-123 pt-45 mx-10">
        {!showNewPasswordScreen ? (
          <ForgotPasswordForm mode={otpMode} setMode={switchOtpMode} onContinue={onIdentifierFillProceed} />
        ) : (
          <NewPasswordForm onContinue={onNewPasswordFillProceed} disableSubmit={newPasswordSubmitPending} />
        )}
      </div>
      <Button primary ghost className="self-center capitalize" onClick={backToLoginHandler}>
        {t('back_to_login')}
      </Button>
    </>
  );
};

export default ForgotPassword;

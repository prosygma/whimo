import React, { useEffect, useMemo, useState } from 'react';
import type { OtpModes } from '../../views/Registration.tsx';
import { Trans, useTranslation } from 'react-i18next';
import OtpInput from 'react-otp-input';
import Button from '../uikit/Button.tsx';
import { requestVerificationCode } from '../../api/registration.ts';
import type { PasswordResetPayload } from '../../api/types/userTypes.ts';
import type { OtpChannel } from '../../api/types/registrationTypes.ts';
import { useLocation } from 'react-router';

interface Props {
  mode: OtpModes;
  /** Channel reported by the backend when the code was sent (e.g. WhatsApp for phones). */
  channel?: OtpChannel;
  identifier: string;
  onContinue: (data: Pick<PasswordResetPayload, 'identifier' | 'code'>) => void;
  disableSubmit?: boolean;
  setMode?: (value: OtpModes) => void;
}

const OtpScreen: React.FC<Props> = ({ mode, channel, identifier, setMode, onContinue, disableSubmit = false }) => {
  const { t } = useTranslation(['registration', 'common']);
  const { pathname } = useLocation();

  const [code, setCode] = useState<string>('');
  const [deliveredBy, setDeliveredBy] = useState<OtpChannel | undefined>(channel);

  useEffect(() => {
    setDeliveredBy(channel);
  }, [channel]);

  const headerKey = mode === 'phone' && deliveredBy === 'whatsapp' ? 'otp_whatsapp_header' : `otp_${mode}_header`;

  const authCompletion = useMemo(() => {
    return pathname === '/registration';
  } , [pathname]);

  const resendCode = async () => {
    setDeliveredBy(await requestVerificationCode(identifier));
  };

  const switchModeHandler = () => {
    if (mode === 'email') {
      setMode?.('phone');
    } else {
      setMode?.('email');
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-8 w-123 pt-45 mx-10">
        <div>
          <h1 className="text-headline-1 mb-2">{t(headerKey)}</h1>
          <p className="text-gray-60">{authCompletion ? t('otp_complete_auth_description') : t('otp_common_description', { ns: 'common' })}</p>
        </div>
        <OtpInput
          value={code}
          onChange={setCode}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          skipDefaultStyles
          containerStyle="flex justify-between"
          inputStyle="size-15 text-headline-2 outline-none border border-gray-10 rounded-lg text-center"
        />
        <Button disabled={disableSubmit} primary onClick={() => onContinue({ code, identifier })}>
          {t('confirm', { ns: 'common' })}
        </Button>
        <Trans
          ns="common"
          i18nKey="didnt_receive_the_code"
          components={{
            wrap: <p className="text-center" />,
            btn: (
              <Button primary ghost className="inline" onClick={() => resendCode()}>
                {''}
              </Button>
            ),
          }}
        />
      </div>
      {setMode && (
        <Button primary ghost className="inline" onClick={switchModeHandler}>
          {mode === 'email' ? t('continue_with_phone', { ns: 'common' }) : t('continue_with_email', { ns: 'common' })}
        </Button>
      )}
    </>
  );
};

export default OtpScreen;

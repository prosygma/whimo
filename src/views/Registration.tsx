import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LanguageIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { RegistrationFormSchema } from '../api/schemas/registrationSchema.ts';
import type { RegistrationForm, RegistrationPayload } from '../api/types/registrationTypes.ts';
import Input from '../components/uikit/Input.tsx';
import PhoneInput from '../components/uikit/PhoneInput.tsx';
import Checkbox from '../components/uikit/Checkbox.tsx';
import Button from '../components/uikit/Button.tsx';
import { confirmGadget, registerUser } from '../api/registration.ts';
import { Link, useNavigate } from 'react-router';
import { Trans, useTranslation } from 'react-i18next';
import GoogleAuthButton from '../components/uikit/GoogleAuthButton.tsx';
import { useLanguage } from '../hooks/useLanguage.ts';
import LanguageSwitchModal from '../components/LanguageSwitchModal.tsx';
import { useMutation } from '@tanstack/react-query';
import OtpModeSelectionModal from '../components/Registration/OtpModeSelectionModal.tsx';
import OtpScreen from '../components/Registration/OtpScreen.tsx';
import type { LoginMethod } from './Login.tsx';
import { authUser } from '../api/auth.ts';
import { useTokens } from '../hooks/useTokens.ts';
import handleError from '../helpers/handleError.ts';

export type OtpModes = LoginMethod;

const Registration: React.FC = () => {
  const { t } = useTranslation(['registration', 'common']);
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { setTokens } = useTokens();

  const {
    register,
    control,
    handleSubmit,
    getFieldState,
    clearErrors,
    formState: { errors, isValid, isSubmitted },
  } = useForm({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const [acceptedTermsAndConditions, setAcceptedTermsAndConditions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [confirmationModeSelectionModalOpen, setConfirmationModeSelectionModalOpen] = useState(false);
  const [otpMode, setOtpMode] = useState<OtpModes | null>(null);
  const [formSubmittedValues, setFormSubmittedValues] = useState<RegistrationPayload>();

  const formValid = useMemo(() => {
    return (isValid || !isSubmitted) && acceptedTermsAndConditions;
  }, [isValid, isSubmitted, acceptedTermsAndConditions]);

  const identifier = useMemo(() => {
    if (otpMode && formSubmittedValues?.[otpMode]) {
      return formSubmittedValues[otpMode];
    }
  }, [formSubmittedValues, otpMode]);

  const [email, phone] = useWatch({ name: ['email', 'phone'], control });

  useEffect(() => {
    if (getFieldState('phone').error || getFieldState('email').error) {
      clearErrors(['phone', 'email']);
    }
  }, [clearErrors, email, phone, getFieldState]);

  const confirmRegistration = (variables: RegistrationPayload) => {
    if (variables.email && variables.phone) {
      setConfirmationModeSelectionModalOpen(true);
      return;
    }

    if (variables.email) {
      setOtpMode('email');
    }

    if (variables.phone) {
      setOtpMode('phone');
    }
  };

  const {
    mutate: createUser,
    isSuccess,
    isPending,
  } = useMutation({
    mutationKey: ['registration'],
    mutationFn: registerUser,
    onSuccess: (_, variables) => {
      setFormSubmittedValues(variables);
      confirmRegistration(variables);
    },
    onError: handleError,
  });

  const onSubmit = ({ confirmPassword: _, ...registrationData }: RegistrationForm) => {
    createUser(registrationData);
  };


  const { mutate: submitCode, isPending: codeSubmitPending } = useMutation({
    mutationFn: confirmGadget,
    onSuccess: async () => {
      if (!identifier || !formSubmittedValues?.password) return;

      const { data } = await authUser({username: identifier, password: formSubmittedValues.password});
      if (data && data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        navigate('/transactions');
      }
    },
    onError: handleError,
  });

  const setMode = (value: OtpModes) => {
    setOtpMode(value);
  };

  if (otpMode && identifier) {
    return (
      <OtpScreen
        mode={otpMode}
        identifier={identifier}
        onContinue={(data) => submitCode(data)}
        disableSubmit={codeSubmitPending}
      />
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col gap-8 w-full max-w-123 pt-4 lg:pt-0 mx-auto px-4 lg:px-0">
        <div>
          <h1 className="text-headline-1 mb-2">{t('register_header')}</h1>
          <p className="text-body-m text-gray-60">{t('register_description')}</p>
        </div>
        <form id="registrationForm" className="[&>*]:mb-6 [&>*]:last:mb-0" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label={t('email', { ns: 'common' })}
            placeholder={t('email_placeholder', { ns: 'common' })}
            StartIcon={EnvelopeIcon}
            {...register('email')}
            error={errors.email?.message}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PhoneInput
                label={t('phone', { ns: 'common' })}
                value={value}
                onChange={(value) => onChange(value ?? '')}
                error={errors.phone?.message}
              />
            )}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('password', { ns: 'common' })}
            placeholder={t('password_placeholder')}
            StartIcon={LockClosedIcon}
            TrailingIcon={showPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowPassword(!showPassword)}
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('password_confirm')}
            placeholder={t('password_confirm_placeholder')}
            StartIcon={LockClosedIcon}
            TrailingIcon={showPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowPassword(!showPassword)}
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />
          <Checkbox
            checked={acceptedTermsAndConditions}
            onChange={(e) => setAcceptedTermsAndConditions(e.target.checked)}
          >
            <p>{t('terms_and_conditions')}</p>
          </Checkbox>
        </form>
        <div className="flex flex-col gap-6 flex-1">
          <Button disabled={!formValid || isSuccess || isPending} primary type="submit" form="registrationForm">
            {t('register_button')}
          </Button>
          <p className="flex items-center gap-4 before:content-[''] before:h-0.25 before:block before:flex-1 before:bg-linear-to-r before:from-gray-20 before:from-50% before:to-transparent before:to-50% before:bg-size-[8px_1px] after:content-[''] after:h-0.25 after:block after:flex-1 after:bg-linear-to-r after:from-gray-20 after:from-50% after:to-transparent after:to-50% after:bg-size-[8px_1px]">
            {t('or', { ns: 'common' })}
          </p>
          <GoogleAuthButton />
          <p className="text-body-m text-center">
            <Trans
              ns="registration"
              i18nKey="already_have_account"
              components={{
                navigation: <Link to="/login" />,
                btn: (
                  <Button primary ghost className="inline">
                    {''}
                  </Button>
                ),
              }}
            />
          </p>
        </div>
      </div>
      <Button primary ghost className="self-center" Icon={LanguageIcon} onClick={() => setLanguageModalOpen(true)}>
        {t(`language_${currentLanguage}`, { ns: 'common' })}
      </Button>
      <LanguageSwitchModal isOpen={languageModalOpen} onClose={() => setLanguageModalOpen(false)} />
      <OtpModeSelectionModal
        isOpen={confirmationModeSelectionModalOpen}
        onClose={() => setConfirmationModeSelectionModalOpen(false)}
        setMode={setMode}
      />
    </>
  );
};

export default Registration;

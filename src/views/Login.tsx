import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormSchema } from '../api/schemas/loginSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginForm } from '../api/types/loginTypes.ts';
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, LanguageIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Input from '../components/uikit/Input.tsx';
import Button from '../components/uikit/Button.tsx';
import { Link } from 'react-router';
import { authUser } from '../api/auth.ts';
import { useTokens } from '../hooks/useTokens.ts';
import { useNavigate } from 'react-router';
import PhoneInput from '../components/uikit/PhoneInput.tsx';
import GoogleAuthButton from '../components/uikit/GoogleAuthButton.tsx';
import { useLanguage } from '../hooks/useLanguage.ts';
import LanguageSwitchModal from '../components/LanguageSwitchModal.tsx';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import OtpScreen from '../components/Registration/OtpScreen.tsx';
import { confirmGadget, requestVerificationCode } from '../api/registration.ts';
import handleError from '../helpers/handleError.ts';

export type LoginMethod = 'email' | 'phone';

const Login: React.FC = () => {
  const { t } = useTranslation(['login', 'common']);
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const { setTokens } = useTokens();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [formSubmittedValues, setFormSubmittedValues] = useState<LoginForm>();

  useEffect(() => {
    reset();
  }, [loginMethod, reset]);

  const { mutate: submit, isPending } = useMutation({
    mutationKey: ['login', loginMethod],
    mutationFn: authUser,
    onSuccess: ({ data }) => {
      setTokens(data.access, data.refresh);
      navigate('/transactions');
    },
    onError: async (error, variables) => {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 403 &&
        error.response?.data?.code === 'jwt.no_verified_gadget'
      ) {
        setShowOtpScreen(true);
        setFormSubmittedValues({ ...variables });
        await requestVerificationCode(variables.username);
      } else {
        handleError(error);
      }
    },
  });

  const { mutate: submitCode, isPending: codeSubmitPending } = useMutation({
    mutationFn: confirmGadget,
    onSuccess: async () => {
      if (!formSubmittedValues?.username || !formSubmittedValues?.password) return;

      const { data } = await authUser({ ...formSubmittedValues });
      if (data && data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        navigate('/transactions');
      }
    },
    onError: handleError,
  });

  const submitHandler = async (loginData: LoginForm) => {
    submit(loginData);
  };

  if (showOtpScreen && formSubmittedValues?.username) {
    return (
      <OtpScreen
        mode={loginMethod}
        identifier={formSubmittedValues.username}
        onContinue={(data) => submitCode(data)}
        disableSubmit={codeSubmitPending}
      />
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col gap-8 w-123 pt-35 mx-10">
        <div>
          <h1 className="text-headline-1 mb-2">{t('login_header')}</h1>
          <p className="text-body-m text-gray-60">{t('login_description')}</p>
          <div className="pt-3 flex">
            <button
              className={`flex-1 py-3 text-center text-body-medium-m text-primary ${loginMethod === 'email' ? 'border-b-2 border-primary' : 'border-b border-gray-10'}`}
              onClick={() => setLoginMethod('email')}
            >
              {t('email_login_tab')}
            </button>
            <button
              className={`flex-1 py-3 text-center text-body-medium-m text-primary ${loginMethod === 'phone' ? 'border-b-2 border-primary' : 'border-b border-gray-10'}`}
              onClick={() => setLoginMethod('phone')}
            >
              {t('phone_login_tab')}
            </button>
          </div>
        </div>
        <form id="loginForm" className="[&>*]:mb-6 [&>*]:last:mb-0" onSubmit={handleSubmit(submitHandler)}>
          {loginMethod === 'email' ? (
            <Input
              label={t('email', { ns: 'common' })}
              StartIcon={EnvelopeIcon}
              placeholder={t('email_placeholder', { ns: 'common' })}
              {...register('username')}
              error={errors.username?.message}
            />
          ) : (
            <Controller
              name="username"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  label={t('phone', { ns: 'common' })}
                  value={value}
                  onChange={(value) => onChange(value ?? '')}
                  error={errors.username?.message}
                />
              )}
            />
          )}
          <Input
            type={showPassword ? 'text' : 'password'}
            label={t('password', { ns: 'common' })}
            placeholder={t('password_placeholder', { ns: 'common' })}
            StartIcon={LockClosedIcon}
            TrailingIcon={showPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowPassword(!showPassword)}
            {...register('password')}
            error={errors.password?.message}
            link={{ label: t('forgot_password'), action: () => navigate('/forgot-password') }}
          />
        </form>
        <div className="flex flex-col gap-6 flex-1">
          <Button disabled={!isValid || isPending} primary type="submit" form="loginForm">
            {t('login_button')}
          </Button>
          <p className="flex items-center gap-4 before:content-[''] before:h-0.25 before:block before:flex-1 before:bg-linear-to-r before:from-gray-20 before:from-50% before:to-transparent before:to-50% before:bg-size-[8px_1px] after:content-[''] after:h-0.25 after:block after:flex-1 after:bg-linear-to-r after:from-gray-20 after:from-50% after:to-transparent after:to-50% after:bg-size-[8px_1px]">
            {t('or', { ns: 'common' })}
          </p>
          <GoogleAuthButton />
          <p className="text-body-m text-center">
            <Trans
              ns="login"
              i18nKey="dont_have_account"
              components={{
                navigation: <Link to="/registration" />,
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
    </>
  );
};

export default Login;

import React, { useState } from 'react';
import Button from '../uikit/Button.tsx';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Input from '../uikit/Input.tsx';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordFormSchema } from '../../api/schemas/userSchema.ts';
import type { NewPasswordForm as NewPasswordFormType } from '../../api/types/userTypes.ts';

interface Props {
  onContinue: (password: string) => void;
  disableSubmit?: boolean;
}

const NewPasswordForm: React.FC<Props> = ({ onContinue, disableSubmit = false }) => {
  const { t } = useTranslation(['forgot_password', 'common']);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(NewPasswordFormSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const submitFormHandler = (data: NewPasswordFormType) => {
    onContinue(data.password);
  };

  return (
    <>
      <div>
        <h1 className="text-headline-1 mb-2">{t('new_password_header')}</h1>
        <p className="text-body-m text-gray-60">{t('new_password_description')}</p>
      </div>
      <form id="newPasswordForm" className="[&>*]:mb-6 [&>*]:last:mb-0" onSubmit={handleSubmit(submitFormHandler)}>
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('new_password', { ns: 'common' })}
          placeholder={t('new_password_placeholder', { ns: 'common' })}
          StartIcon={LockClosedIcon}
          TrailingIcon={showPassword ? EyeIcon : EyeSlashIcon}
          trailingIconAction={() => setShowPassword(!showPassword)}
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          label={t('confirm_password', { ns: 'common' })}
          placeholder={t('new_password_confirm_placeholder', { ns: 'common' })}
          StartIcon={LockClosedIcon}
          TrailingIcon={showPassword ? EyeIcon : EyeSlashIcon}
          trailingIconAction={() => setShowPassword(!showPassword)}
          {...register('confirm_password')}
          error={errors.confirm_password?.message}
        />
      </form>
      <Button primary disabled={!isValid || disableSubmit} type="submit" form="newPasswordForm">
        {t('confirm', { ns: 'common' })}
      </Button>
    </>
  );
};

export default NewPasswordForm;

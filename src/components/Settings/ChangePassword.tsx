import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../uikit/Button.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordFormSchema } from '../../api/schemas/userSchema.ts';
import type { ChangePasswordForm } from '../../api/types/userTypes.ts';
import Input from '../uikit/Input.tsx';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../../api/user.ts';

const ChangePassword: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    resolver: zodResolver(ChangePasswordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['changePassword'],
    mutationFn: changePassword,
  });

  const submitFormHandler = (data: ChangePasswordForm) => {
    const { confirm_password: _, ...payload } = data;
    mutate(payload);
  };

  const resetFormHandler = () => {
    reset();
  };

  return (
    <div className="flex flex-col [&>*]:px-10 [&>*]:py-8">
      <div className="flex-1">
        <h3 className="text-headline-2 mb-8">{t('change_password_header')}</h3>
        <form
          id="accounInfoForm"
          className="w-110 [&>*]:mb-6 [&>*]:last:mb-0"
          onSubmit={handleSubmit(submitFormHandler)}
        >
          <Input
            type={showCurrentPassword ? 'text' : 'password'}
            label={t('current_password')}
            placeholder={t('current_password_placeholder')}
            StartIcon={LockClosedIcon}
            TrailingIcon={showCurrentPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowCurrentPassword(!showCurrentPassword)}
            autoComplete="off"
            {...register('current_password')}
            error={errors.current_password?.message}
          />
          <Input
            type={showNewPassword ? 'text' : 'password'}
            label={t('new_password', { ns: 'common' })}
            placeholder={t('new_password_placeholder', { ns: 'common' })}
            StartIcon={LockClosedIcon}
            TrailingIcon={showNewPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowNewPassword(!showNewPassword)}
            autoComplete="off"
            {...register('new_password')}
            error={errors.new_password?.message}
          />
          <Input
            type={showNewPassword ? 'text' : 'password'}
            label={t('confirm_password', { ns: 'common' })}
            placeholder={t('new_password_confirm_placeholder', { ns: 'common' })}
            StartIcon={LockClosedIcon}
            TrailingIcon={showNewPassword ? EyeIcon : EyeSlashIcon}
            trailingIconAction={() => setShowNewPassword(!showNewPassword)}
            autoComplete="off"
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />
        </form>
      </div>
      <div className="border-t-2 border-gray-5 flex justify-between items-center">
        <Button disabled={!isDirty} onClick={resetFormHandler}>
          {t('discard_changes')}
        </Button>
        <Button disabled={!isDirty || isPending} primary type="submit" form="accounInfoForm">
          {t('save_changes')}
        </Button>
      </div>
    </div>
  );
};

export default ChangePassword;

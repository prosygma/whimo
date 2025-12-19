import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { DocumentDuplicateIcon, EnvelopeIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Input from '../uikit/Input.tsx';
import PhoneInput from '../uikit/PhoneInput.tsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteGadget, fetchProfileData, updateGadget } from '../../api/user.ts';
import { AccountInfoSchema } from '../../api/schemas/userSchema.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AccountInfo } from '../../api/types/userTypes.ts';
import { extractProfileData } from './helpers/extractProfileData.ts';
import Note from '../uikit/Note.tsx';
import GadgetVerificationModal from './Modals/GadgetVerificationModal.tsx';
import Button from '../uikit/Button.tsx';
import handleError from '../../helpers/handleError.ts';

export type VerificationType = 'email' | 'phone';

const Info: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);

  const [verificationModalType, setVerificationModalType] = useState<VerificationType | null>(null);

  const {
    data: profileData,
    isSuccess,
    refetch: refetchProfileData,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchProfileData,
    select: (data) => extractProfileData(data.data),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { dirtyFields, errors, isDirty },
  } = useForm({
    resolver: zodResolver(AccountInfoSchema),
    defaultValues: {
      user_id: '',
      email: '',
      phone: '',
    },
  });

  const { mutate: gadgetMutation, isPending: mutationPending } = useMutation({
    mutationKey: ['gadgetUpdate'],
    mutationFn: updateGadget,
    onSuccess: async ({ data: { type } }) => {
      setVerificationModalType(type);
      await refetchProfileData();
    },
    onError: handleError,
  });

  useEffect(() => {
    if (isSuccess && profileData) {
      reset(profileData.form);
    }
  }, [profileData, isSuccess, reset]);

  const verificationIdentifier = useMemo(() => {
    if (!verificationModalType) return;

    return profileData?.form?.[verificationModalType];
  }, [profileData?.form, verificationModalType]);

  const resetFormHandler = () => {
    reset(profileData?.form);
  };

  const submitFormHandler = (data: AccountInfo) => {
    const payload: Partial<AccountInfo> = {};

    for (const key in dirtyFields) {
      if (dirtyFields[key as keyof AccountInfo]) {
        payload[key as keyof AccountInfo] = data[key as keyof AccountInfo];
      }
    }

    gadgetMutation(payload);
  };

  const copyHandler = (key: keyof AccountInfo) => {
    const value = getValues(key);
    void navigator.clipboard.writeText(value);
  };

  const emailNeedVerification = !!profileData?.form.email && !profileData?.verificationStatus?.email;
  const phoneNeedVerification = !!profileData?.form.phone && !profileData?.verificationStatus?.phone;

  const emailIsReadonly = !profileData?.form.phone || phoneNeedVerification || 'phone' in dirtyFields;
  const phoneIsReadonly = !profileData?.form.email || emailNeedVerification || 'email' in dirtyFields;

  const emailDisabled = 'phone' in dirtyFields;
  const phoneDisabled = 'email' in dirtyFields;

  const onSuccessfulVerification = async () => {
    if (verificationModalType && profileData?.removeOnVerificationsSuccess?.[verificationModalType]) {
      await deleteGadget(profileData?.removeOnVerificationsSuccess?.[verificationModalType]);
    }
    await refetchProfileData();
  };

  return (
    <>
      <div className="flex flex-col [&>*]:px-10 [&>*]:py-8">
        <div className="flex-1">
          <h3 className="text-headline-2 mb-8">{t('account_info_header')}</h3>
          <form
            id="accounInfoForm"
            className="w-110 [&>*]:mb-6 [&>*]:last:mb-0"
            onSubmit={handleSubmit(submitFormHandler)}
          >
            <Input
              label={t('user_id', { ns: 'common' })}
              StartIcon={UserCircleIcon}
              TrailingIcon={DocumentDuplicateIcon}
              disabled
              readOnly
              trailingIconAction={() => copyHandler('user_id')}
              {...register('user_id')}
              error={errors.user_id?.message}
            />
            <Input
              label={t('email', { ns: 'common' })}
              StartIcon={EnvelopeIcon}
              TrailingIcon={DocumentDuplicateIcon}
              trailingIconAction={() => copyHandler('email')}
              readOnly={emailIsReadonly}
              disabled={emailDisabled}
              {...register('email')}
              error={errors.email?.message}
            />
            {emailNeedVerification && (
              <Note
                type="warning"
                message={t('email_not_verified_note')}
                cta={
                  <button type="button" className="text-button-m" onClick={() => setVerificationModalType('email')}>
                    {t('verify')}
                  </button>
                }
              />
            )}
            <Controller
              name="phone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  label={t('phone', { ns: 'common' })}
                  readOnly={phoneIsReadonly}
                  disabled={phoneDisabled}
                  value={value}
                  onChange={(value) => onChange(value ?? '')}
                  error={errors.phone?.message}
                  TrailingIcon={DocumentDuplicateIcon}
                  trailingIconAction={() => copyHandler('phone')}
                />
              )}
            />
            {phoneNeedVerification && (
              <Note
                type="warning"
                message={t('phone_not_verified_note')}
                cta={
                  <button type="button" className="text-button-m" onClick={() => setVerificationModalType('phone')}>
                    {t('verify')}
                  </button>
                }
              />
            )}
          </form>
        </div>
        <div className="border-t-2 border-gray-5 flex justify-between items-center">
          <Button disabled={!isDirty} onClick={resetFormHandler}>
            {t('discard_changes')}
          </Button>
          <Button disabled={!isDirty || mutationPending} primary type="submit" form="accounInfoForm">
            {t('save_changes')}
          </Button>
        </div>
      </div>
      {verificationModalType && verificationIdentifier && (
        <GadgetVerificationModal
          type={verificationModalType}
          identifier={verificationIdentifier}
          isOpen={Boolean(verificationModalType)}
          onClose={() => setVerificationModalType(null)}
          onSuccess={onSuccessfulVerification}
        />
      )}
    </>
  );
};

export default Info;

import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ArrowLeftIcon, ArrowDownTrayIcon, ShieldCheckIcon, DevicePhoneMobileIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/uikit/Button.tsx';
import { useNavigate } from 'react-router';

const Download: React.FC = () => {
  const { t } = useTranslation(['download', 'common']);
  const navigate = useNavigate();

  const backToLoginHandler = () => {
    navigate('/login');
  };

  return (
    <>
      <div className="flex-1 flex flex-col gap-8 w-full max-w-123 pt-10 lg:pt-24 px-4 lg:px-0 mx-auto">
        <div>
          <h1 className="text-headline-1 mb-2 text-primary flex items-center gap-2">
            <DevicePhoneMobileIcon className="w-8 h-8" strokeWidth={2} />
            {t('title')}
          </h1>
          <p className="text-body-m text-gray-60">
            {t('subtitle')}
          </p>
        </div>

        <div className="bg-primary-subtle border border-primary/20 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-surface-dark">{t('banner_title')}</h3>
              <p className="text-sm text-gray-70 mt-1">
                {t('banner_desc')}
              </p>
            </div>
          </div>
          
          <a
            href="https://github.com/prosygma/whimo-android/releases/download/apk-61/camertrace_61.apk"
            className="w-full flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary-hover active:bg-primary-active py-3.5 px-6 rounded-lg font-medium text-center transition-all shadow-md mt-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5 animate-bounce" />
            {t('download_btn')}
          </a>

          <p className="text-sm text-gray-70">{t('uninstall_old_app')}</p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-headline-2 text-surface-dark">{t('steps_title')}</h2>
          
          <div className="relative border-l-2 border-primary/20 pl-6 ml-3 flex flex-col gap-8">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[37px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm shadow-sm">
                1
              </span>
              <h3 className="font-semibold text-surface-dark text-body-l">{t('step_1_title')}</h3>
              <p className="text-sm text-gray-60 mt-1">
                <Trans
                  ns="download"
                  i18nKey="step_1_desc"
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[37px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm shadow-sm">
                2
              </span>
              <h3 className="font-semibold text-surface-dark text-body-l">{t('step_2_title')}</h3>
              <p className="text-sm text-gray-60 mt-1">
                {t('step_2_desc')}
                <span className="block mt-2 pl-3 border-l-2 border-gray-20 text-xs text-gray-50 flex flex-col gap-1">
                  <span>
                    <Trans
                      ns="download"
                      i18nKey="step_2_bullet_1"
                      components={{ bold: <strong /> }}
                    />
                  </span>
                  <span>
                    <Trans
                      ns="download"
                      i18nKey="step_2_bullet_2"
                      components={{ bold: <strong /> }}
                    />
                  </span>
                </span>
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[37px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-semibold text-sm shadow-sm">
                3
              </span>
              <h3 className="font-semibold text-surface-dark text-body-l">{t('step_3_title')}</h3>
              <p className="text-sm text-gray-60 mt-1">
                <Trans
                  ns="download"
                  i18nKey="step_3_desc"
                  components={{ bold: <strong /> }}
                />
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-[37px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-success text-white font-semibold text-sm shadow-sm">
                <CheckCircleIcon className="w-5 h-5" />
              </span>
              <h3 className="font-semibold text-success text-body-l">{t('step_4_title')}</h3>
              <p className="text-sm text-gray-60 mt-1">
                {t('step_4_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button primary ghost className="self-center capitalize flex items-center gap-2 mt-4" onClick={backToLoginHandler}>
        <ArrowLeftIcon className="w-4 h-4" />
        {t('back_to_login')}
      </Button>
    </>
  );
};

export default Download;

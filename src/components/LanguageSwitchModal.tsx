import React from 'react';
import Modal from './uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage.ts';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import LanguageFlag from './LanguageFlag.tsx';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LanguageSwitchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('select_language')} onClose={onClose} />
      <Modal.ModalBody>
        <div className="flex flex-col gap-4">
          {supportedLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="px-6 py-3 rounded-lg border border-gray-10 cursor-pointer flex items-center gap-2 hover:border-sea-blue shadow-[0_1px_2px_0_#1018280D]"
            >
              <LanguageFlag language={language} />
              <p className="flex-1 text-left">
                {t(`language_${language.code}`, { ns: 'common', defaultValue: language.name })}
              </p>
              {language.code === currentLanguage && <CheckCircleIcon className="size-6 text-success shrink-0" />}
            </button>
          ))}
        </div>
      </Modal.ModalBody>
    </Modal>
  );
};

export default LanguageSwitchModal;

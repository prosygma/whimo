import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import type { TransactionUser } from '../../../api/types/transactionTypes.ts';

import { DocumentDuplicateIcon, EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  merchantData?: TransactionUser;
}

const MerchantInfo: React.FC<Props> = ({ merchantData, isOpen, onClose }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('merchant_info_modal_title')} onClose={onClose} />
      <Modal.ModalBody>
        {merchantData?.id && (
          <div className="[&&]:py-4 flex gap-2">
            <UserIcon className="size-6 text-gray-50" />
            <div className="flex-1">
              <p className="text-body-medium-m">{merchantData.id}</p>
              <p className="mt-0.5 text-body-s text-gray-60">{t('merchant_info_modal_user_id')}</p>
            </div>
            <DocumentDuplicateIcon
              className="size-6 text-gray-50 hover:text-gray-70 cursor-pointer"
              onClick={() => copyToClipboard(merchantData.id)}
            />
          </div>
        )}
        {merchantData?.gadgets.map((gadget) => {
          let icon = <EnvelopeIcon className="size-6 text-gray-50" />;
          let identifier = gadget.identifier;

          if (gadget.type === 'phone') {
            icon = <PhoneIcon className="size-6 text-gray-50" />;
            identifier = `+${identifier}`;
          }

          return (
            <div key={gadget.id} className="[&&]:py-4 flex gap-2">
              {icon}
              <div className="flex-1">
                <p className="text-body-medium-m">{identifier}</p>
                <p className="mt-0.5 text-body-s text-gray-60">{t(`merchant_info_modal_${gadget.type}`)}</p>
              </div>
              <DocumentDuplicateIcon
                className="size-6 text-gray-50 hover:text-gray-70 cursor-pointer"
                onClick={() => copyToClipboard(identifier)}
              />
            </div>
          );
        })}
      </Modal.ModalBody>
    </Modal>
  );
};

export default MerchantInfo;

import React from 'react';
import Modal from '../../uikit/Modal.tsx';
import { useTranslation } from 'react-i18next';
import TraceabilityStatus from '../../uikit/TraceabilityStatus.tsx';
import { useQuery } from '@tanstack/react-query';
import { fetchAppOptions, type TraceabilityKey } from '../../../api/appOptions.ts';

const STATUSES: TraceabilityKey[] = ['full', 'conditional', 'partial', 'incomplete'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TraceabilityStatusDescription: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation(['transactions', 'common']);
  // The statuses follow the admin's traceability rules, so the backend writes their explanation.
  // The bundled text stays while loading, offline, or for a status without one.
  const { data: options } = useQuery({
    queryKey: ['appOptions', i18n.language],
    queryFn: fetchAppOptions,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('traceability_status_info_modal_title')} onClose={onClose} />
      <Modal.ModalBody>
        <p className="[&&]:py-4 text-body-s text-gray-60">{t('traceability_status_info_modal_description')}</p>
        {STATUSES.map((status) => (
          <div key={status} className="[&&]:py-4 flex flex-col gap-2">
            <TraceabilityStatus traceability={status} />
            <p className="text-body-s text-gray-60">
              {options?.traceability_descriptions?.[status] || t(`traceability_status_${status}_description`)}
            </p>
          </div>
        ))}
      </Modal.ModalBody>
    </Modal>
  );
};

export default TraceabilityStatusDescription;

import React, { useEffect, useState } from 'react';
import Modal from '../../uikit/Modal.tsx';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../../uikit/Button.tsx';
import { useQuery } from '@tanstack/react-query';
import { downloadBundle } from '../../../api/transactions.ts';
import { triggerFileDownload } from '../../../helpers/triggerFileDownload.ts';

interface Props {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

export type Geolocation = {
  fullTraceability?: number;
  manualUpload?: number;
  noLocations?: number;
};

const DownloadLocationsModal: React.FC<Props> = ({ transactionId, isOpen, onClose, onCancel }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const [headerData, setHeaderData] = useState<Geolocation>({});

  const {
    data: response,
    status,
    isPending,
  } = useQuery({
    queryKey: ['downloadGeolocations', transactionId],
    queryFn: () => downloadBundle(transactionId),
    enabled: isOpen,
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (status !== 'success' || !response?.headers) {
      setHeaderData({});
      return;
    }

    setHeaderData((prevState) => ({
      ...prevState,
      fullTraceability: parseInt(response.headers['x-geojson-merged-transactions'], 10),
      manualUpload: parseInt(response.headers['x-custom-location-file-transactions'], 10),
      noLocations: parseInt(response.headers['x-no-location-file-transactions'], 10),
    }));
  }, [response?.data, response?.headers, status]);

  const traceabilityList = (
    <ul className="pl-3.5 pt-2 flex flex-col gap-2">
      {isPending ? (
        <div className="shimmer h-5.5 w-[70%] rounded-sm" />
      ) : (
        Boolean(headerData.fullTraceability) && (
          <li className="list-disc marker:text-sea-blue">
            <Trans
              ns="transactions"
              i18nKey="full_traceability"
              count={headerData.fullTraceability}
              components={[<span className="font-medium" />]}
            />
          </li>
        )
      )}
      {isPending ? (
        <div className="shimmer h-5.5 w-[70%] rounded-sm" />
      ) : (
        Boolean(headerData.manualUpload) && (
          <li className="list-disc marker:text-sea-blue">
            <Trans
              ns="transactions"
              i18nKey="manual_upload"
              count={headerData.manualUpload}
              components={[<span className="font-medium" />]}
            />
          </li>
        )
      )}
      {isPending ? (
        <div className="shimmer h-5.5 w-[70%] rounded-sm" />
      ) : (
        Boolean(headerData.noLocations) && (
          <li className="list-disc marker:text-sea-blue">
            <Trans
              ns="transactions"
              i18nKey="no_locations"
              count={headerData.noLocations}
              components={[<span className="font-medium" />]}
            />
          </li>
        )
      )}
    </ul>
  );

  const handleDownload = () => {
    if (!response?.data) return;
    triggerFileDownload(response.data, `transaction_${transactionId}_bundle.zip`);

    onClose();
  };

  return (
    <Modal isOpen={isOpen}>
      <Modal.ModalHeader title={t('download_farm_locations_header')} onClose={onClose} />
      <Modal.ModalBody>
        <div className="text-body-m">
          <Trans ns="transactions" i18nKey="download_farm_locations_description" components={{ traceabilityList }} />
        </div>
      </Modal.ModalBody>
      <Modal.ModalFooter className="grid gap-3 grid-cols-2">
        <Button onClick={onCancel}>{t('cancel', { ns: 'common' })}</Button>
        <Button primary onClick={handleDownload} disabled={isPending}>
          {t('download')}
        </Button>
      </Modal.ModalFooter>
    </Modal>
  );
};

export default DownloadLocationsModal;

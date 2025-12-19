import React, { useMemo, useState } from 'react';
import TraceabilityStatus from '../../uikit/TraceabilityStatus.tsx';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import DoughnutChart from '../../uikit/DoughnutChart.tsx';
import TransactionStatus from '../../uikit/TransactionStatus.tsx';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import TraceabilityStatusDescription from '../Modals/TraceabilityStatusDescription.tsx';
import MerchantInfo from '../Modals/MerchantInfo.tsx';
import { useQuery } from '@tanstack/react-query';
import type { TraceabilityCountsResponsePayload, TransactionItem } from '../../../api/types/transactionTypes.ts';
import { fetchTraceabilityCounts } from '../../../api/transactions.ts';
import { buildTraceabilityCountChartDataset } from '../../../helpers/buildTraceabilityCountChartDataset.ts';
import Note from '../../uikit/Note.tsx';
import Button from '../../uikit/Button.tsx';

interface Props {
  transaction: TransactionItem;
}

const TransactionDetails: React.FC<Props> = ({ transaction }) => {
  const { t } = useTranslation(['transactions', 'common']);

  const [traceabilityStatusModalOpen, setTraceabilityStatusModalOpen] = useState(false);
  const [merchantInfoModalOpen, setMerchantInfoModalOpen] = useState(false);

  const { data: traceabilityCounts, isPending: traceabilityCountsPending } =
    useQuery<TraceabilityCountsResponsePayload>({
      queryKey: ['traceabilityCounts', transaction.id],
      queryFn: () => fetchTraceabilityCounts(transaction.id),
    });

  const { chartData: traceabilityChartDataset, total: traceabilityTotalCount } = useMemo(() => {
    return buildTraceabilityCountChartDataset(traceabilityCounts);
  }, [traceabilityCounts]);

  const merchantData = useMemo(() => {
    if (transaction.action === 'buying' && transaction?.seller) {
      return transaction.seller;
    } else if (transaction.action === 'selling' && transaction?.buyer) {
      return transaction.buyer;
    }
  }, [transaction.action, transaction.buyer, transaction.seller]);

  const showSupplierInfo = ['accepted', 'rejected', 'pending'].includes(transaction.status) && Boolean(transaction?.seller?.id);
  const showExpirationDate =
    (['accepted', 'pending'].includes(transaction.status) || transaction.is_automatic) && transaction.expires_at;
  const missingFarmGeodata = !transaction.farm_latitude || !transaction.farm_longitude;

  const myId = transaction.action === 'buying' ? transaction.buyer.id : transaction.seller.id;

  return (
    <>
      <div>
        <p className="text-body-s text-gray-60 mb-0.5">{t('drawer_commodity_type_title')}</p>
        <p className="">
          {transaction.commodity.code} {transaction.commodity.name}
        </p>
      </div>
      {!transaction.is_automatic ? (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <p className="text-body-s text-gray-60 flex-1">{t('drawer_traceability_status_title')}</p>
            <TraceabilityStatus traceability={transaction.traceability} />
            <ChevronRightIcon
              className="size-5 text-gray-40 cursor-pointer hover:text-gray-60"
              onClick={() => setTraceabilityStatusModalOpen(true)}
            />
          </div>
          <div className="h-20">
            <DoughnutChart
              height={80}
              loading={traceabilityCountsPending}
              data={traceabilityChartDataset}
              legendGrid={{ columns: 3 }}
              doughnutConfig={{
                radius: 40,
                cutout: 30,
                borderRadius: 2,
                borderWidth: 1,
              }}
              wrapperClass="px-6"
              centerContent={
                <div className="text-center">
                  <p className="text-body-medium-m">
                    {traceabilityTotalCount}
                    <span className="text-body-xs text-gray-60 block">{t('traders')}</span>
                  </p>
                </div>
              }
            />
          </div>
        </div>
      ) : missingFarmGeodata ? (
        <div className="flex justify-between items-center">
          <p className="text-body-s text-gray-60">{t('drawer_transaction_farm_geodata_title')}</p>
          <p className="text-body-m text-error">{t('missing_data')}</p>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-body-s text-gray-60">{t('drawer_transaction_farm_geodata_title')}</p>
          <p className="text-body-m ">{t('provided_from_file')}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <p className="text-body-s text-gray-60">{t('drawer_buyer_id_title')}</p>
        <p
          className={`ml-10 flex-1 text-right text-nowrap overflow-hidden text-ellipsis ${transaction.action !== 'buying' && 'font-medium'}`}
        >
          {transaction?.buyer?.id ? `${transaction?.buyer?.id}` : 'N/A'}
        </p>
        {transaction.action === 'buying'
          ? '(You)'
          : transaction?.buyer && (
            <ChevronRightIcon
              className="size-5 text-gray-40 cursor-pointer hover:text-gray-60"
              onClick={() => setMerchantInfoModalOpen(true)}
            />
          )}
      </div>
      {showSupplierInfo && (
        <div className="flex items-center gap-2">
          <p className="text-body-s text-gray-60">{t('drawer_supplier_information_title')}</p>
          <p
            className={`ml-10 flex-1 text-right text-nowrap overflow-hidden text-ellipsis ${transaction.action !== 'selling' && 'font-medium'}`}
          >
            {transaction.seller.id}
          </p>
          {transaction.action === 'selling'
            ? '(You)'
            : transaction.seller && (
              <ChevronRightIcon
                className="size-5 text-gray-40 cursor-pointer hover:text-gray-60"
                onClick={() => setMerchantInfoModalOpen(true)}
              />
            )}
        </div>
      )}
      <div className="flex justify-between items-center">
        <p className="text-body-s text-gray-60">{t('drawer_transaction_status_title')}</p>
        <TransactionStatus automatic={transaction?.is_automatic} status={transaction.status} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-body-s text-gray-60">{t('drawer_transaction_date_title')}</p>
        {format(new Date(transaction.created_at), 'MMM dd, yyyy hh:mm aaa')}
      </div>
      {showExpirationDate && (
        <div className="flex justify-between items-center">
          <p className="text-body-s text-gray-60">{t('drawer_transaction_expiration_title')}</p>
          {format(new Date(transaction.expires_at || ''), 'MMM dd, yyyy hh:mm aaa')}
        </div>
      )}
      {transaction.status === 'pending' && (
        <div className="absolute bottom-0 right-0 w-full [&&]:p-6 flex flex-col gap-6 shadow-[0_-4px_12px_0_#1018280F] z-1">
          <Note type="info" message={t('transaction_action_alert_open_mobile_action')}/>
          <div className="grid grid-cols-2 gap-3">
            {transaction.created_by_id === myId ? (
              <>
                <Button disabled>{t('cancel_transaction')}</Button>
                <Button primary disabled>
                  {t('resend_notification')}
                </Button>
              </>
            ) : (
              <>
                <Button disabled>{t('reject_transaction')}</Button>
                <Button primary disabled>
                  {t('accept_transaction')}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      {transaction.is_automatic && missingFarmGeodata && (
        <div className="absolute bottom-0 right-0 w-full [&&]:p-6 flex flex-col gap-6 shadow-[0_-4px_12px_0_#1018280F] z-1">
          <Note type="info" message={t('transaction_action_alert_open_mobile_geodata')}/>
          <div className="grid grid-cols-2 gap-3">
            <Button disabled>{t('i_dont_have_data')}</Button>
            <Button primary disabled>
              {t('add_farm_geodata')}
            </Button>
          </div>
        </div>
      )}
      <TraceabilityStatusDescription
        isOpen={traceabilityStatusModalOpen}
        onClose={() => setTraceabilityStatusModalOpen(false)}
      />
      <MerchantInfo
        isOpen={merchantInfoModalOpen}
        onClose={() => setMerchantInfoModalOpen(false)}
        merchantData={merchantData}
      />
    </>
  );
};

export default TransactionDetails;

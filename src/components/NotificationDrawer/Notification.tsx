import React, { useState } from 'react';
import type { NotificationItem } from '../../api/types/notificationTypes.ts';
import { useTranslation } from 'react-i18next';
import { formatNotificationDistance } from '../../helpers/formatNotificationDistance.ts';
import Button from '../uikit/Button.tsx';
import NotificationDetailsDrawer from './NotificationDetailsDrawer.tsx';
import { fetchSingleTransaction } from '../../api/transactions.ts';
import { useQuery } from '@tanstack/react-query';

interface Props {
  notification: NotificationItem;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const { t } = useTranslation(['notifications', 'common']);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  const { data: transaction } = useQuery({
    queryKey: ['notificationTransactionDetails', notification.data.transaction.id],
    queryFn: () => fetchSingleTransaction(notification.data.transaction.id),
    enabled: detailsDrawerOpen,
  });

  const amount = `${notification.data.transaction.volume} ${notification.data.transaction.commodity.unit}`;
  const requireAction = notification.type === 'transaction_pending' || notification.type === 'geodata_missing';

  return (
    <>
      <div>
        <div className="flex gap-3">
          <div className="flex-1">
            <h6 className="mb-1 text-body-medium-m">{t(notification.type)}</h6>
            <p className="text-gray-60">
              {notification.data.transaction.commodity.name}, {amount}
            </p>
          </div>
          <div className="text-body-s text-gray-60 text-right text-nowrap">
            {formatNotificationDistance(notification.created_at)}
          </div>
        </div>
        {requireAction && (
          <Button className="mt-3" primary ghost onClick={() => setDetailsDrawerOpen(true)}>
            {t('view_details')}
          </Button>
        )}
      </div>
      <NotificationDetailsDrawer
        isOpen={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        transaction={transaction}
      />
    </>
  );
};

export default Notification;

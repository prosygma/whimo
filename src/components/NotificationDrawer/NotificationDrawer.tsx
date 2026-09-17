import React, { useMemo, useState } from 'react';
import SideDrawer from '../uikit/SideDrawer.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { InboxIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useInfiniteQuery } from '@tanstack/react-query';
import Notification from './Notification.tsx';
import EmptyPlaceholder from '../EmptyPlaceholder.tsx';
import Button from '../uikit/Button.tsx';
import { PAGE_SIZE } from '../../contanst.ts';
import type { NotificationItem, NotificationResponse } from '../../api/types/notificationTypes.ts';
import { fetchNotifications } from '../../api/notifications.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export type NotificationTab = 'all' | 'action';

const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['notifications', 'common']);
  const [notificationTab, setNotificationTab] = useState<NotificationTab>('all');

  const transactionsParams = useMemo(() => {
    const params = new URLSearchParams();

    params.append('page_size', PAGE_SIZE);
    if (notificationTab === 'action') {
      params.append('types', 'transaction_pending');
      params.append('types', 'geodata_missing');
    }

    return params;
  }, [notificationTab]);

  const {
    data: notificationsResponse,
    fetchNextPage,
    hasNextPage,
    isSuccess,
  } = useInfiniteQuery<NotificationResponse>({
    queryKey: ['notifications', notificationTab],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams(transactionsParams);
      params.set('page', String(pageParam));
      return fetchNotifications(params);
    },
    getNextPageParam: (lastPage) => lastPage.pagination.next_page ?? undefined,
    initialPageParam: 1,
    enabled: isOpen,
  });

  const notificationsList = useMemo(() => {
    if (!notificationsResponse) return [];

    return notificationsResponse?.pages.reduce<NotificationItem[]>((acc, current) => {
      return [...acc, ...current.data];
    }, []);
  }, [notificationsResponse]);

  return (

    <SideDrawer isOpen={isOpen} align="left" onClose={onClose} scrollable>
      <SideDrawer.SideDrawerHeader
        title={t('notifications')}
        className="[&&]:py-6"
      >
        <XMarkIcon className="size-6 cursor-pointer hover:text-gray-70" onClick={onClose} />
      </SideDrawer.SideDrawerHeader>
      <>
        <div className="flex [&&]:py-0">
          <button
            className={`flex-1 py-3 text-center text-body-medium-m text-primary border-b-2 ${notificationTab === 'all' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setNotificationTab('all')}
          >
            {t('all_notifications')}
          </button>
          <button
            className={`flex-1 py-3 text-center text-body-medium-m text-primary border-b-2 ${notificationTab === 'action' ? 'border-primary' : 'border-transparent'}`}
            onClick={() => setNotificationTab('action')}
          >
            {t('require_actions_notifications')}
          </button>
        </div>
        {notificationsList.length > 0
          ? notificationsList.map((notification) => (
            <Notification
              key={notification.id}
              notification={notification}
            />
          ))
          : isSuccess && (
            <EmptyPlaceholder
              Icon={InboxIcon}
              title={t('notifications_empty_list_title')}
              className="flex-1 [&&]:pt-20"
            >
              <Trans
                ns="notifications"
                i18nKey="notifications_empty_list_description"
                components={[<p className="mt-3 mb-2.5" />, <p />]}
              />
            </EmptyPlaceholder>
          )}
        {hasNextPage && (
          <div className="flex-1 flex items-start justify-center [&&]:bg-transparent mb-10">
            <Button className="[&&]:bg-transparent" ghost primary onClick={() => fetchNextPage()}>
              {t('load_more', { ns: 'common' })}
            </Button>
          </div>
        )}
      </>
    </SideDrawer>
  );
};

export default NotificationDrawer;

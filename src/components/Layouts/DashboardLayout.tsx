import React, { useState } from 'react';
import MenuItem from '../MenuItem.tsx';
import { useTranslation } from 'react-i18next';
import {
  BellIcon,
  ChartPieIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import NotificationDrawer from '../NotificationDrawer/NotificationDrawer.tsx';
import { Outlet } from 'react-router';

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation('common');

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="grid grid-cols-[280px_auto]">
      <div className="bg-midnight-blue text-white py-10 flex flex-col gap-10 sticky top-0 h-min min-h-screen">
        <div className="px-8 text-sea-blue font-semibold text-4xl select-none">WHIMO</div>
        <nav className="flex-1 flex flex-col gap-2">
          <MenuItem
            showActiveState={!notificationsOpen}
            label={t('transactions')}
            Icon={Squares2X2Icon}
            route={'/transactions'}
          />
          <MenuItem
            showActiveState={!notificationsOpen}
            label={t('balance')}
            Icon={Square3Stack3DIcon}
            route={'/balance'}
          />
          <button
            onClick={() => setNotificationsOpen(true)}
            className={`${notificationsOpen && 'active'} outline-none px-8 py-3 flex items-center gap-3 text-button-m text-menu-item-icon-inactive hover:text-sky-blue hover:[&>p]:text-white hover:shadow-[4px_0_0_0_var(--color-sea-blue)_inset] [&.active]:text-sky-blue [&.active]:shadow-[4px_0_0_0_var(--color-sea-blue)_inset] [&.active>p]:text-white [&.active]:bg-linear-to-r [&.active]:from-[#298FC24D] [&.active]:to-transparent`}
          >
            <BellIcon className="size-7" />
            <p>{t('notifications')}</p>
          </button>
          <MenuItem
            showActiveState={!notificationsOpen}
            label={t('analytics')}
            Icon={ChartPieIcon}
            route={'/analytics'}
          />
          <MenuItem
            showActiveState={!notificationsOpen}
            label={t('settings')}
            Icon={Cog6ToothIcon}
            route={'/settings'}
          />
        </nav>
        <div className="flex flex-col gap-2">
          <a
            className="px-8 py-3 flex items-center gap-3 text-button-m text-menu-item-icon-inactive hover:text-sky-blue hover:[&>p]:text-white"
            href="mailto:whimoapp@gmail.com?subject=WHIMO%20App%20Feedback"
          >
            <ChatBubbleLeftEllipsisIcon className="size-7" />
            <p>{t('feedback')}</p>
          </a>
        </div>
        <NotificationDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      </div>
      <div className="flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

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
import { Link, Outlet } from 'react-router';

import emblem from '../../assets/camertrace-emblem.png';

const DashboardLayout: React.FC = () => {
  const { t } = useTranslation('common');

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="grid grid-cols-[280px_auto]">
      <div className="bg-surface-dark text-white py-10 flex flex-col gap-10 sticky top-0 h-min min-h-screen">
        <Link to="/transactions" className="px-8 flex items-center gap-3 outline-none">
          <img src={emblem} alt="" aria-hidden="true" className="w-10 h-auto object-contain shrink-0" />
          <span className="text-white font-semibold text-3xl select-none tracking-wide">CamerTrace</span>
        </Link>
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
            className={`${notificationsOpen && 'active'} outline-none px-8 py-3 flex items-center gap-3 text-button-m text-nav-inactive hover:text-nav-active hover:[&>p]:text-white hover:shadow-[4px_0_0_0_var(--color-accent)_inset] [&.active]:text-nav-active [&.active]:shadow-[4px_0_0_0_var(--color-accent)_inset] [&.active>p]:text-white [&.active]:bg-linear-to-r [&.active]:from-accent/20 [&.active]:to-transparent`}
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
            className="px-8 py-3 flex items-center gap-3 text-button-m text-nav-inactive hover:text-nav-active hover:[&>p]:text-white"
            href="mailto:contact@camertrace.cm?subject=CamerTrace%20Web%20-%20Retour%20utilisateur"
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

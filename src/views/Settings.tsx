import React, { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader/PageHeader.tsx';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  ArrowRightStartOnRectangleIcon,
  LanguageIcon,
  LockClosedIcon,
  TrashIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import LogoutModal from '../components/Settings/Modals/LogoutModal.tsx';
import DeleteAccountModal from '../components/Settings/Modals/DeleteAccountModal.tsx';

const Settings: React.FC = () => {
  const { t } = useTranslation(['settings', 'common']);
  const location = useLocation();
  const navigate = useNavigate();

  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === '/settings') {
      navigate('/settings/info', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    setLogoutModalOpen(true);
  };
  const handleDeleteAccount = () => {
    setDeleteAccountModalOpen(true);
  };

  return (
    <>
      <PageHeader title={t('settings_page_header')} />
      <div className="flex-1 grid grid-cols-[280px_1fr]">
        <div className="flex flex-col border-r-2 border-gray-5">
          <nav className="flex-1 flex flex-col">
            <NavLink
              to="/settings/info"
              className="px-10 py-5 flex gap-4 text-button-m text-gray-60 border-b-2 border-gray-5 [&.active]:bg-light-blue [&.active]:text-gray-90 [&.active]:border-transparent [&.active>svg]:text-sea-blue"
            >
              <UserCircleIcon className="size-6 shrink-0" /> {t('settings_nav_info')}
            </NavLink>
            <NavLink
              to="/settings/change-password"
              className="px-10 py-5 flex gap-4 text-button-m text-gray-60 border-b-2 border-gray-5 [&.active]:bg-light-blue [&.active]:text-gray-90 [&.active]:border-transparent [&.active>svg]:text-sea-blue"
            >
              <LockClosedIcon className="size-6 shrink-0" /> {t('settings_nav_change_password')}
            </NavLink>
            <NavLink
              to="/settings/language"
              className="px-10 py-5 flex gap-4 text-button-m text-gray-60 border-b-2 border-gray-5 [&.active]:bg-light-blue [&.active]:text-gray-90 [&.active]:border-transparent [&.active>svg]:text-sea-blue"
            >
              <LanguageIcon className="size-6 shrink-0" /> {t('settings_nav_language')}
            </NavLink>
          </nav>
          <button
            onClick={handleLogout}
            className="px-10 py-5 flex gap-4 text-button-m text-gray-60 border-t-2 border-gray-5 "
          >
            <ArrowRightStartOnRectangleIcon className="size-6 shrink-0" />
            {t('setting_nav_logout')}
          </button>
          <button
            onClick={handleDeleteAccount}
            className="px-10 py-5 flex gap-4 text-button-m text-gray-60 border-t-2 border-gray-5 "
          >
            <TrashIcon className="size-6 shrink-0" />
            {t('setting_nav_delete_account')}
          </button>
        </div>
        <Outlet />
      </div>
      <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
      <DeleteAccountModal isOpen={deleteAccountModalOpen} onClose={() => setDeleteAccountModalOpen(false)} />
    </>
  );
};

export default Settings;

import React, { useCallback, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTokens } from '../../hooks/useTokens.ts';
import { authGoogle } from '../../api/auth.ts';

const NoAuthLayout: React.FC = () => {
  const { t } = useTranslation('common');

  const { isAuthenticated, setTokens } = useTokens();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const googleAuth = useCallback(
    async (code: string) => {
      const { data } = await authGoogle({ code, redirect_uri: `${import.meta.env.VITE_BASE_URL}/oauth/callback` });

      if (data && data.access && data.refresh) {
        setTokens(data.access, data.refresh);
        navigate('/transactions');
      }
    },
    [navigate, setTokens],
  );

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      searchParams.delete('code');
      void googleAuth(code);
    }
  }, [googleAuth, searchParams]);

  if (isAuthenticated) {
    return <Navigate to="/transactions" replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-[minmax(auto,708px)_1fr]">
      <div className="px-10 flex flex-col justify-center items-center gap-8 text-white text-center relative bg-[url(/src/assets/whimo_logo.svg),linear-gradient(to_bottom,_var(--color-sea-blue),_var(--color-berry-blue))] bg-center bg-cover bg-no-repeat">
        <p className="uppercase text-[26px] leading-5.5">
          <span className="block text-[70px] leading-13.5 font-semibold mb-2">WHIMO</span>What is my origin
        </p>
        <p className="max-w-117 opacity-80">{t('splash_description')}</p>
      </div>
      <div className="flex flex-col gap-8 mx-auto mb-10">
        <Outlet />
      </div>
    </div>
  );
};

export default NoAuthLayout;

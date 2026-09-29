import React, { useCallback, useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTokens } from '../../hooks/useTokens.ts';
import { authGoogle } from '../../api/auth.ts';
import { brand } from '../../brand';

const heroGradient = 'linear-gradient(to bottom, var(--color-hero-start), var(--color-hero-end))';
const heroBackground = brand.heroWatermark ? `url("${brand.heroWatermark}"), ${heroGradient}` : heroGradient;

const NoAuthLayout: React.FC = () => {
  const { t, i18n } = useTranslation('common');

  const { isAuthenticated, setTokens } = useTokens();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const googleAuth = useCallback(
    async (code: string) => {
      const { data } = await authGoogle({
        code,
        redirect_uri: `${import.meta.env.VITE_BASE_URL}/oauth/callback`,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      });

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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[708px_1fr]">
      <div
        className="px-6 py-12 lg:px-10 lg:py-16 flex flex-col justify-between items-center gap-8 text-white text-center relative bg-center bg-cover bg-no-repeat min-h-[450px] lg:min-h-screen"
        style={{ backgroundImage: heroBackground }}
      >
        <div className="flex-1 flex flex-col justify-center items-center gap-6 lg:gap-8">
          {brand.heroLogo && (
            <img
              src={brand.heroLogo}
              alt={brand.name}
              className="w-44 lg:w-64 max-w-full h-auto animate-fade-up"
            />
          )}
          <p className="uppercase text-[22px] lg:text-[26px] leading-5.5">
            <span className="block text-[48px] lg:text-[70px] leading-tight lg:leading-13.5 font-heading font-semibold mb-2">{brand.name}</span>
            {brand.taglineFor(i18n.language)}
          </p>
          <p className="max-w-117 opacity-80 text-sm lg:text-base">{brand.heroDescriptionFor(i18n.language) ?? t('splash_description')}</p>
        </div>

        <div className="w-full mt-auto pt-6 border-t border-white/15">
          <Link
            to="/download"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all shadow-sm backdrop-blur-xs hover:scale-105"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.523 15.3l1.82-3.15c.16-.28.06-.63-.22-.79-.28-.16-.63-.06-.79.22L16.5 14.73C15.15 13.9 13.61 13.43 12 13.43s-3.15.47-4.5 1.3l-1.83-3.16c-.16-.28-.51-.38-.79-.22-.28.16-.38.51-.22.79l1.82 3.15C3.89 16.92 2 19.74 2 23h20c0-3.26-1.89-6.08-4.47-7.7zM7 20c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM12 2.01c-3.12 0-5.75 2.19-6.42 5.12h12.84c-.67-2.93-3.3-5.12-6.42-5.12z" />
            </svg>
            {t('download_apk_link')}
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full px-4 py-12 lg:py-16 lg:px-10 min-h-[60vh] lg:min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default NoAuthLayout;

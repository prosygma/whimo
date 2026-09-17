import { Route, Routes } from 'react-router';
import Registration from './views/Registration.tsx';
import Login from './views/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import RootRedirect from './components/RootRedirect.tsx';
import DashboardLayout from './components/Layouts/DashboardLayout.tsx';
import Transactions from './views/Transactions.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Balance from './views/Balance.tsx';
import Settings from './views/Settings.tsx';
import Info from './components/Settings/Info.tsx';
import ChangePassword from './components/Settings/ChangePassword.tsx';
import Language from './components/Settings/Language.tsx';
import LanguageProvider from './components/LanguageProvider.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NoAuthLayout from './components/Layouts/NoAuthLayout.tsx';
import Analytics from './views/Analytics.tsx';
import AxiosInterceptor from './components/AxiosInterceptor.tsx';
import ForgotPassword from './views/ForgotPassword.tsx';
import Download from './views/Download.tsx';
import Terms from './views/Terms.tsx';
import Privacy from './views/Privacy.tsx';
import AccountDeletion from './views/AccountDeletion.tsx';
import { ToastContainer } from 'react-toastify';
import renderToastIcon from './helpers/renderToastIcon.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AxiosInterceptor />
        <ToastContainer
          className="text-body-medium-m"
          position="top-right"
          autoClose={5000}
          theme="colored"
          hideProgressBar
          icon={renderToastIcon}
          closeButton={false}
        />
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            {/* Public legal pages: deliberately outside NoAuthLayout, which
                redirects authenticated users away and would break these links
                from inside the mobile app or from the Play Store listing. */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/account-deletion" element={<AccountDeletion />} />
            <Route element={<NoAuthLayout />}>
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/oauth/callback" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/download" element={<Download />} />
              <Route path="/dowload" element={<Download />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />}>
                  <Route path="info" element={<Info />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="language" element={<Language />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </LanguageProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

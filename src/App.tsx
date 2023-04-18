import 'react-toastify/dist/ReactToastify.css';
import './styles/toastify.css';

import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import { ToastContainer } from 'react-toastify';

import { UserContextProvider } from './contexts/UserContext';
import { useEagerConnect, useWeb3Listener } from './hooks';
import Layout from './v2/components/Layout';
import MobileMenu from './v2/components/MobileMenu';
import AuthPage from './v2/pages/AuthPage';
import CartPage from './v2/pages/CartPage';
import CheckoutPage from './v2/pages/CheckoutPage';
import CheckoutSuccessPage from './v2/pages/CheckoutSuccessPage';
import EmailVerifyPage from './v2/pages/EmailVerifyPage';
import Enable2faPage from './v2/pages/Enable2faPage';
import Home from './v2/pages/Home';
import MarketplacePage from './v2/pages/MarketplacePage';
import PrivacyPolicyPage from './v2/pages/PrivacyPolicyPage';
import ProductPage from './v2/pages/ProductPage';
import ProfilePage from './v2/pages/ProfilePage';
import ResetPasswordPage from './v2/pages/ResetPasswordPage';
import TermsAndConditionsPage from './v2/pages/TermsAndConditionsPage';
import UnsubscribePage from './v2/pages/UnsubscribePage';
import UpdatePasswordPage from './v2/pages/UpdatePasswordPage';
import Verify2faPage from './v2/pages/Verify2faPage';

const authPages = [
  'login',
  'signup',
  'register',
  'verify-email-confirmation',
  'forgot-password',
  'reset-password',
  'enable-2fa',
  'verify-2fa',
];

const App = () => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const location = useLocation();

  useEagerConnect();
  useWeb3Listener();

  const toggleMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <UserContextProvider>
      <ParallaxProvider>
        <ToastContainer hideProgressBar={true} theme="colored" />
        <Layout
          menuOpened={isMenuOpened}
          nude={authPages.includes(location?.pathname.split('/')[1])}
          onToggleMenu={toggleMenu}
        >
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Home />} path="/home" />
            <Route element={<AuthPage type="login" />} path="/login" />
            <Route element={<AuthPage />} path="/signup" />
            <Route element={<AuthPage />} path="/register" />
            <Route
              element={<EmailVerifyPage />}
              path="/verify-email-confirmation/:code"
            />
            <Route element={<UnsubscribePage />} path="/unsubscribe" />
            <Route element={<TermsAndConditionsPage />} path="/tac" />
            <Route element={<PrivacyPolicyPage />} path="/privacy-policy" />
            <Route element={<ResetPasswordPage />} path="/forgot-password" />
            <Route element={<UpdatePasswordPage />} path="/reset-password" />
            <Route element={<Enable2faPage />} path="/enable-2fa" />
            <Route element={<Verify2faPage />} path="/verify-2fa" />
            <Route element={<MarketplacePage />} path="/game/:name" />
            <Route element={<MarketplacePage />} path="/game" />
            <Route element={<ProductPage />} path="/product/:name/:id" />
            <Route element={<CartPage />} path="/cart" />
            <Route element={<CheckoutPage />} path="/checkout" />
            <Route
              element={<CheckoutSuccessPage />}
              path="/checkout/:success"
            />
            <Route
              element={<ProfilePage tab="order-history" />}
              path="/profile"
            />
            <Route
              element={<ProfilePage tab="order-history" />}
              path="/profile/order-history"
            />
            <Route
              element={<ProfilePage tab="tiers" />}
              path="/profile/tiers"
            />
            <Route
              element={<ProfilePage tab="security" />}
              path="/profile/security"
            />
            <Route
              element={<ProfilePage tab="profile" />}
              path="/profile/profile"
            />
          </Routes>
          {isMenuOpened && (
            <MobileMenu onClose={() => setIsMenuOpened(false)} />
          )}
        </Layout>
      </ParallaxProvider>
    </UserContextProvider>
  );
};

export default App;

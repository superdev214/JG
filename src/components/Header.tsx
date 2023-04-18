import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { isChrome, isEdge, isFirefox } from 'react-device-detect';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { OrderApi } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import iconCart from '../assets/svgs/cart.svg';
import iconDiscord from '../assets/svgs/icon-discord.svg';
// import iconGitBook from '../assets/svgs/icon-gitbook.svg';
import iconMedium from '../assets/svgs/icon-medium.svg';
import iconTelegram from '../assets/svgs/icon-telegram.svg';
import iconTwitter from '../assets/svgs/icon-twitter.svg';
import iconInfo from '../assets/svgs/info.svg';
import iconMenu from '../assets/svgs/sandwich.svg';
import iconClose from '../assets/svgs/times.svg';
import iconUser from '../assets/svgs/user.svg';
import { UserContext } from '../contexts/UserContext';
import { ICartItem } from '../type';

const authLinks = [
  '/profile',
  '/verify-email-confirmation/',
  '/unsubscribe',
  '/enable-2fa',
  '/verify-2fa',
  '/game',
  '/product/',
  '/cart',
  '/checkout',
  '/profile',
];

export const navMenu = [
  { link: '/signup', title: 'Sign Up' },
  { default: true, link: '/login', title: 'Sign In' },
];

export const navMenuLoggedIn = [
  { link: '/cart', title: 'Cart' },
  // { link: '/verify-email', title: 'Verify Email' },
  // { link: '/enable-2fa', title: 'Enable 2FA' },
  { link: '/profile', title: 'Profile' },
];

export const socialLink = [
  {
    icon: iconTelegram,
    link: 'https://t.me/JoystickCommunity',
    title: 'Telegram',
  },
  {
    icon: iconTwitter,
    link: 'https://twitter.com/joystickpros',
    title: 'Twitter',
  },
  {
    icon: iconDiscord,
    link: 'https://discord.gg/JoystickGames',
    title: 'Discord',
  },
  {
    icon: iconMedium,
    link: 'https://joystick-games.medium.com/',
    title: 'Medium',
  },
  // {
  //   icon: iconGitBook,
  //   link: 'https://docs.joystickguild.com/',
  //   title: 'GitBook',
  // },
];

const Header = ({
  menuOpened,
  onToggleMenu,
}: {
  menuOpened: boolean;
  onToggleMenu: () => void;
}) => {
  const {
    authData,
    isFirstLoaded,
    loggedIn,
    productsInCart,
    setAuthData,
    setLoggedIn,
    setProductsInCart,
  } = useContext(UserContext);
  const [shownMenu, showMenu] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkPagePermisson = (path: string) => {
    for (const rt of authLinks) {
      if (path.startsWith(rt)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (loggedIn) {
      OrderApi.cart()
        .then((res) => {
          setProductsInCart(res as ICartItem[]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [loggedIn, setProductsInCart]);

  useEffect(() => {
    if (!isFirstLoaded) return;
    if (typeof window !== 'undefined') {
      if (checkPagePermisson(location.pathname) && !loggedIn) {
        navigate(`/login?redirect=${location.pathname}`);
      }
    }
  }, [isFirstLoaded, location, loggedIn, navigate]);

  return (
    <>
      {isChrome || isEdge || isFirefox ? null : (
        <div tw="px-8 w-full min-h-[65px] flex items-center gap-4 font-medium bg-[#FFA92C]">
          <img alt="info" src={iconInfo} width={24} />
          It looks like you're using an unsupported browser. To use Metamask,
          please switch to Chrome or Firefox.
        </div>
      )}
      <header
        style={{
          background:
            'linear-gradient(to right, rgb(27, 40, 79), rgb(2, 9, 27), rgb(27, 40, 79))',
        }}
        tw="px-[5%] w-full sticky top-0 z-50"
      >
        <div tw="w-full h-[88px] flex justify-between items-center">
          <Link to="/">
            <img alt="logo" src={imgLogo} tw="max-w-[162px]" />
          </Link>
          <div tw="items-center gap-10 hidden md:flex">
            <ul tw="flex items-center gap-5">
              {loggedIn ? (
                <>
                  <li>
                    <Link
                      to="/cart"
                      tw="relative w-14 h-14 flex justify-center items-center border-4 border-[#35924A] bg-[#35924A66] rounded-2xl"
                    >
                      <img alt="cart" src={iconCart} width={20} />
                      {productsInCart && productsInCart.length > 0 ? (
                        <span tw="px-1.5 absolute right-1.5 top-1.5 text-xs bg-[#dc3545] rounded-full z-50">
                          {productsInCart.length}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                  <li tw="relative">
                    <button
                      title={authData && authData.user.email}
                      tw="px-8 h-[56px] flex items-center capitalize text-white bg-[#35924A] rounded-2xl cursor-pointer"
                      onClick={() => showMenu(!shownMenu)}
                    >
                      <img alt="cart" src={iconUser} width={24} />
                      <span tw="pl-2">
                        {authData &&
                          (authData.user.username ||
                            authData.user?.email?.split('@')[0])}
                      </span>
                    </button>
                    {shownMenu && (
                      <>
                        <div
                          tw="fixed left-0 top-0 w-full h-full z-30"
                          onClick={() => showMenu(false)}
                        />
                        <ul
                          tw="absolute w-full text-center bg-[#000c] rounded-lg z-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            showMenu(false);
                          }}
                        >
                          {/* <li>
                            <Link
                              title="Verify email"
                              to="/verify-email"
                              tw="flex h-12 justify-center items-center hover:bg-[#fff2]"
                            >
                              Verify Email
                            </Link>
                          </li> */}
                          {/* {authData?.user.verification?.totp?.enabled ? null : (
                            <li>
                              <Link
                                title="Enable 2FA"
                                to="/enable-2fa"
                                tw="flex h-12 justify-center items-center hover:bg-[#fff2]"
                              >
                                Enable 2FA
                              </Link>
                            </li>
                          )} */}
                          <li>
                            <Link
                              to="/profile"
                              tw="flex h-12 justify-center items-center hover:bg-[#fff2]"
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              tw="flex w-full h-12 justify-center items-center hover:bg-[#fff2]"
                              onClick={() => {
                                window.localStorage.removeItem('accessToken');
                                window.localStorage.removeItem('refreshToken');
                                setAuthData(undefined);
                                setLoggedIn(false);
                                navigate('/');
                              }}
                            >
                              Sign Out
                            </button>
                          </li>
                        </ul>
                      </>
                    )}
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/signup"
                      tw="h-[56px] flex items-center capitalize text-white"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      tw="px-8 h-[56px] flex items-center capitalize text-white bg-[#35924A] rounded-2xl"
                    >
                      Sign In
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <button tw="block md:hidden" onClick={() => onToggleMenu()}>
            <img alt="menu" src={menuOpened ? iconClose : iconMenu} />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;

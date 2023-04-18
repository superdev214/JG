import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { isChrome, isEdge, isFirefox } from 'react-device-detect';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { OrderApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { ICartItem } from '../../type';
import imgLogo from '../assets/images/logo-light.png';
import iconBook from '../assets/svgs/book.svg';
import iconCart from '../assets/svgs/cart.svg';
import iconDiscord from '../assets/svgs/discord.svg';
import iconInfo from '../assets/svgs/info.svg';
import iconInstagram from '../assets/svgs/instagram.svg';
import iconMenu from '../assets/svgs/menu.svg';
import iconTelegram from '../assets/svgs/telegram.svg';
import iconTiktok from '../assets/svgs/tiktok.svg';
import iconClose from '../assets/svgs/times.svg';
import iconTwitter from '../assets/svgs/twitter.svg';
import iconUser from '../assets/svgs/user.svg';

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
    icon: iconBook,
    link: 'https://whitepaper.joystickgaming.io/',
    title: 'Docs',
  },
  {
    icon: iconTwitter,
    link: 'https://twitter.com/joystickpros',
    title: 'Twitter',
  },
  {
    icon: iconDiscord,
    link: 'https://discord.gg/joystickgaming',
    title: 'Discord',
  },
  {
    icon: iconInstagram,
    link: 'https://www.instagram.com/joystick/',
    title: 'Instagram',
  },
  {
    icon: iconTiktok,
    link: 'https://www.tiktok.com/@joystick',
    title: 'Tiktok',
  },
  {
    icon: iconTelegram,
    link: 'https://t.me/joystickgaming',
    title: 'Telegram',
  },
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
      <header tw="px-[5%] w-full absolute top-0 z-50">
        <div tw="w-full h-[88px] flex justify-between items-center">
          <Link to="/">
            <img alt="logo" src={imgLogo} tw="max-w-[162px]" />
          </Link>
          <div tw="items-center gap-10 hidden md:flex">
            <ul tw="flex items-center">
              {loggedIn ? (
                <>
                  <li>
                    <Link
                      to="/cart"
                      tw="block relative w-[98px] h-[39px] hover:opacity-70"
                    >
                      <div tw="absolute left-0 top-0 w-full h-full bg-[#2C263A] skew-x-[-15deg] overflow-hidden z-[60]" />
                      <div tw="absolute left-0 top-0 w-full h-full flex justify-center items-center gap-2 text-[16px] uppercase tracking-[0.22em] z-[61]">
                        <img alt="cart" src={iconCart} width={20} />
                        {productsInCart && productsInCart.length > 0 ? (
                          <span tw="text-base tracking-[0.1em] text-white z-[62]">
                            ({productsInCart.length})
                          </span>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                  <li tw="relative">
                    <button
                      title={authData && authData.user.email}
                      tw="relative w-[133px] h-[39px] hover:opacity-70"
                      onClick={() => showMenu(!shownMenu)}
                    >
                      <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] skew-x-[-15deg] overflow-hidden z-[60]" />
                      <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] text-white z-[61]">
                        Profile
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
                              tw="flex h-12 justify-center items-center text-white hover:bg-[#fff2]"
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              tw="flex w-full h-12 justify-center items-center text-white hover:bg-[#fff2]"
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
                      tw="pr-16 h-[39px] flex items-center uppercase tracking-[0.1em] text-white"
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      tw="relative px-8 w-[133px] h-[39px] flex items-center uppercase text-white"
                    >
                      <div tw="absolute left-0 top-0 w-full h-full -skew-x-12 bg-[#D2193A] z-10" />
                      <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center tracking-[0.1em] z-20">
                        Sign In
                      </span>
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

import { createContext, FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Auth } from '../api/api';
import { AuthResultData, ICartItem } from '../type';

const emptyFunc = () => {};

type UserContextState = {
  isFirstLoaded: boolean;
  authData?: AuthResultData;
  isLoading: boolean;
  isWalletConnectOpened: boolean;
  loggedIn: boolean;
  productsInCart: ICartItem[];
  setAuthData: (value?: AuthResultData) => void;
  setIsLoading: (value: boolean) => void;
  setIsWalletConnectOpened: (value: boolean) => void;
  setLoggedIn: (value: boolean) => void;
  setIsFirstLoaded: (value: boolean) => void;
  setProductsInCart: (value: ICartItem[]) => void;
};

export const UserContext = createContext<UserContextState>({
  authData: undefined,
  isFirstLoaded: false,
  isLoading: false,
  isWalletConnectOpened: false,
  loggedIn: false,
  productsInCart: [],
  setAuthData: emptyFunc,
  setIsFirstLoaded: emptyFunc,
  setIsLoading: emptyFunc,
  setIsWalletConnectOpened: emptyFunc,
  setLoggedIn: emptyFunc,
  setProductsInCart: emptyFunc,
});

export const UserContextProvider: FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthResultData | undefined>(
    undefined
  );
  const [isFirstLoaded, setIsFirstLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isWalletConnectOpened, setIsWalletConnectOpened] =
    useState<boolean>(false);
  const [productsInCart, setProductsInCart] = useState<ICartItem[]>([]);

  const unauthLinks = [
    '/',
    '/signup',
    '/register',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/terms-location',
  ];
  const authLinks = ['/profile'];
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = window.localStorage.getItem('accessToken');
      if (accessToken) {
        Auth.loginByToken()
          .then((res) => {
            setAuthData({
              access_token: authData?.access_token || '',
              refresh_token: authData?.refresh_token || '',
              user: res,
            });
            setLoggedIn(true);
          })
          .finally(() => {
            if (!isFirstLoaded) {
              setIsFirstLoaded(true);
            }
          });
      } else {
        if (authLinks.includes(location.pathname)) {
          if (!loggedIn) {
            navigate('/login');
          }
        }
        if (!isFirstLoaded) {
          setIsFirstLoaded(true);
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        authData,
        isFirstLoaded,
        isLoading,
        isWalletConnectOpened,
        loggedIn,
        productsInCart,
        setAuthData,
        setIsFirstLoaded,
        setIsLoading,
        setIsWalletConnectOpened,
        setLoggedIn,
        setProductsInCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

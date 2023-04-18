import '../styles/common.css';

import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import TermsAndConditions from '../components/TermsAndConditions';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

const AuthPage = (props: { type?: string }) => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const [displayTAC, setDisplayTAC] = useState<boolean>(false);
  const [agreeChecked, setAgreeChecked] = useState<boolean>(false);
  const { loggedIn, setAuthData, setIsLoading, setLoggedIn } =
    useContext(UserContext);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const redirectPath = queryParams.get('redirect');
    if (redirectPath && loggedIn) {
      navigate(redirectPath);
    }
  }, [loggedIn, queryParams, navigate]);

  return (
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      {displayTAC && (
        <div
          tw="fixed p-5 left-0 top-0 right-0 bottom-0 flex justify-center items-center z-50"
          onClick={() => setDisplayTAC(false)}
        >
          <div
            tw="px-4 py-8 relative w-full h-[80vh] max-w-[860px] text-black bg-white rounded-lg overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              tw="absolute right-4 top-0 text-5xl cursor-pointer"
              onClick={() => setDisplayTAC(false)}
            >
              &times;
            </button>
            <TermsAndConditions dark />
          </div>
        </div>
      )}
      <div tw="px-5 w-full max-w-[460px]">
        <header>
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            {props.type === 'login'
              ? 'Sign in to use Marketplace'
              : 'Sign up to use Marketplace'}
          </p>
        </header>
        {props.type === 'login' && (
          <>
            <label
              htmlFor="username"
              tw="pt-6 pb-2 block text-base font-medium"
            >
              Email
            </label>
            <input
              id="username"
              placeholder="Email"
              tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </>
        )}
        {props.type !== 'login' && (
          <>
            <label
              htmlFor="password"
              tw="pt-6 pb-2 block text-base font-medium"
            >
              Email
            </label>
            <input
              id="email"
              placeholder="Email"
              tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <label htmlFor="password" tw="pt-6 pb-2 block text-base font-medium">
          Password
        </label>
        <input
          id="password"
          placeholder="Password"
          tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {props.type === 'login' ? (
          <div tw="pt-[26px] flex justify-center">
            Forgot password?&nbsp;
            <Link to="/forgot-password" tw="text-[#35924A]">
              Reset password
            </Link>
          </div>
        ) : (
          <div tw="pt-[26px] flex items-center">
            <label className="container" tw="flex items-center text-base">
              I agree with Joystick&rsquo;s&nbsp;
              <input
                checked={agreeChecked}
                type="checkbox"
                onChange={() => setAgreeChecked(!agreeChecked)}
              />
              <span className="checkmark"></span>
            </label>
            <button tw="text-[#35924A]" onClick={() => setDisplayTAC(true)}>
              Terms &amp; Conditions
            </button>
          </div>
        )}
        <div tw="pt-8">
          <button
            css={[
              tw`w-full h-[68px] capitalize font-semibold text-xl bg-[#8b8b8b] rounded-2xl`,
              (props.type === 'login' || agreeChecked) &&
                tw`bg-[#35924A] hover:bg-[#246432]`,
            ]}
            onClick={
              props.type === 'login' || agreeChecked
                ? () => {
                    if (props.type === 'login') {
                      setIsLoading(true);
                      Auth.login({ password, username })
                        .then((res) => {
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(
                              'accessToken',
                              res.access_token
                            );
                            window.localStorage.setItem(
                              'refreshToken',
                              res.refresh_token
                            );
                          }
                          setAuthData(res);
                          setLoggedIn(true);
                          navigate(queryParams.get('redirect') ?? '/');
                        })
                        .catch((err) => {
                          toast.error(
                            getMessage(
                              err.response.data?.message ?? err.toString()
                            )
                          );
                          console.error(err.response.data?.message ?? err);
                        })
                        .finally(() => setIsLoading(false));
                    } else {
                      setIsLoading(true);
                      Auth.register({ email, password, username })
                        .then((res) => {
                          if (typeof window !== 'undefined') {
                            window.localStorage.setItem(
                              'accessToken',
                              res.access_token
                            );
                            window.localStorage.setItem(
                              'refreshToken',
                              res.refresh_token
                            );
                          }
                          setAuthData(res);
                          setLoggedIn(true);
                          navigate('/enable-2fa');
                        })
                        .catch((err) => {
                          toast.error(
                            getMessage(
                              err.response.data?.message ?? err.toString()
                            )
                          );
                          console.error(err.response.data?.message ?? err);
                        })
                        .finally(() => setIsLoading(false));
                    }
                  }
                : () => null
            }
          >
            {props.type === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </div>
        <p tw="pt-[34px] text-base text-center">
          {props.type === 'login' ? (
            <span>
              I don&rsquo;t have an account.&nbsp;
              <Link to="/signup" tw="text-[#35924A]">
                Sign Up
              </Link>
            </span>
          ) : (
            <span>
              I already have an account.&nbsp;
              <Link to="/login" tw="text-[#35924A]">
                Sign In
              </Link>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

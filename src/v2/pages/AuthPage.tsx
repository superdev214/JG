import '../../styles/common.css';

import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';
import TermsAndConditions from '../components/TermsAndConditions';

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
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
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
        <Link to="/">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-[20px] leading-[130%] text-center text-[#857E9A]">
            {props.type === 'login'
              ? 'Sign in to use Marketplace'
              : 'Sign up to use Marketplace'}
          </p>
        </Link>
        <div tw="pt-[50px] flex flex-col gap-6">
          {props.type === 'login' && (
            <div tw="relative">
              <label
                htmlFor="username"
                tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
              >
                Email
              </label>
              <input
                id="username"
                placeholder="Email"
                tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          {props.type !== 'login' && (
            <div tw="relative">
              <label
                htmlFor="email"
                tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
              >
                Email
              </label>
              <input
                id="email"
                placeholder="Email"
                tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          <div tw="relative">
            <label
              htmlFor="password"
              tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
            >
              Password
            </label>
            <input
              id="password"
              placeholder="Password"
              tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {props.type === 'login' ? (
          <div tw="pt-4 flex justify-center text-[16px]">
            Forgot password?&nbsp;
            <Link
              to="/forgot-password"
              tw="text-[16px] underline text-[#A237F5]"
            >
              Reset password
            </Link>
          </div>
        ) : (
          <div tw="pt-4 flex items-center">
            <label className="container" tw="flex items-center text-[16px]">
              I agree with Joystick&rsquo;s&nbsp;
              <input
                checked={agreeChecked}
                type="checkbox"
                onChange={() => setAgreeChecked(!agreeChecked)}
              />
              <span className="checkmark"></span>
            </label>
            <button
              tw="text-[16px] text-[#A237F5] underline"
              onClick={() => setDisplayTAC(true)}
            >
              Terms &amp; Conditions
            </button>
          </div>
        )}
        <div tw="pt-8">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
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
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div
                css={[
                  tw`absolute left-0 top-0 w-full h-full bg-[#8b8b8b] origin-top skew-x-[-28deg] overflow-hidden`,
                  (props.type === 'login' || agreeChecked) && tw`bg-[#D2193A]`,
                ]}
              />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              {props.type === 'login' ? 'Sign in' : 'Sign up'}
            </span>
          </button>
        </div>
        <p tw="pt-4 text-base text-center">
          {props.type === 'login' ? (
            <span>
              I don&rsquo;t have an account.&nbsp;
              <Link to="/signup" tw="text-[16px] underline text-[#A237F5]">
                Sign Up
              </Link>
            </span>
          ) : (
            <span>
              I already have an account.&nbsp;
              <Link to="/login" tw="text-[16px] underline text-[#A237F5]">
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

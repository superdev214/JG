import '../../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoading } = useContext(UserContext);
  const [password, setPassword] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setCode(q.get('code') ?? '');
  }, [location]);

  return (
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
      <div tw="px-5 w-full max-w-[460px]">
        <Link to="/">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-xl text-center text-[#857E9A]">
            Please enter your new password
          </p>
        </Link>
        <div tw="pt-[50px] flex flex-col gap-6">
          <div tw="relative">
            <label
              htmlFor="username"
              tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
            >
              New Password
            </label>
            <input
              id="password"
              placeholder="******"
              tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div tw="relative">
            <label
              htmlFor="username"
              tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
            >
              Repeat New Password
            </label>
            <input
              id="password2"
              placeholder="******"
              tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
        </div>
        <div tw="pt-8">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
            onClick={() => {
              setIsLoading(true);
              Auth.resetPassword({
                code,
                newPassword: password,
                repeatNewPassword: password2,
              })
                .then((res) => {
                  if (res) {
                    toast.success('Your password has been updated.', {
                      icon: () => <img alt="send" src={iconCheck} />,
                    });
                    navigate('/');
                  }
                })
                .catch((err) => {
                  toast.error(
                    getMessage(err.response.data?.message ?? err.toString())
                  );
                  console.error(err.response.data?.message ?? err);
                })
                .finally(() => setIsLoading(false));
            }}
          >
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg] overflow-hidden" />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              Confirm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;

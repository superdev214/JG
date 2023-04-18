import '../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

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
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[460px]">
        <header>
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            Please enter your new password
          </p>
        </header>
        <label htmlFor="username" tw="pt-12 pb-2 block text-base font-medium">
          New Password
        </label>
        <input
          id="password"
          placeholder="******"
          tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="username" tw="pt-6 pb-2 block text-base font-medium">
          Repeat New Password
        </label>
        <input
          id="password2"
          placeholder="******"
          tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <div tw="pt-8">
          <button
            tw="w-full h-[68px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
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
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordPage;

import '../styles/common.css';
import 'twin.macro';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

const ResetPasswordPage = () => {
  const { setIsLoading } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');

  return (
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[460px]">
        <header>
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            Forgot your password, let's recover it
          </p>
        </header>
        <label htmlFor="username" tw="pt-12 pb-2 block text-base font-medium">
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
        <div tw="pt-8">
          <button
            tw="w-full h-[68px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
            onClick={() => {
              setIsLoading(true);
              Auth.resetPasswordEmail({
                email: email,
                role: 'USER',
              })
                .then(() => {
                  toast.info(
                    'Your request has been accepted. Please check your email.'
                  );
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
            Recover Password
          </button>
        </div>
        <p tw="pt-[34px] text-base text-center">
          <span>
            Back to&nbsp;
            <Link to="/login" tw="text-[#35924A]">
              Sign In
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

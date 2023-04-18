import '../../styles/common.css';
import 'twin.macro';

import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';

const ResetPasswordPage = () => {
  const { setIsLoading } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');

  return (
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
      <div tw="px-5 w-full max-w-[460px]">
        <Link to="/">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-xl text-center text-[#857E9A]">
            Forgot your password, let's recover it
          </p>
        </Link>
        <div tw="pt-[50px]">
          <div tw="relative">
            <label
              htmlFor="username"
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
        </div>
        <div tw="pt-8">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
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
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg] overflow-hidden" />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              Recover Password
            </span>
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

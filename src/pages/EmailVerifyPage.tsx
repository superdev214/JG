import '../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

const EmailVerifyPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(UserContext);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (params.code) {
      setCode(params.code);
    }
  }, [params]);

  return (
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[460px]">
        <header>
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            Please verify your email
          </p>
        </header>
        <label htmlFor="username" tw="pt-12 pb-2 block text-base font-medium">
          Verification Code
        </label>
        <input
          id="code"
          placeholder="Input code"
          tw="px-8 py-0 w-full h-[68px] text-base bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div tw="pt-8">
          <button
            tw="w-full h-[68px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
            onClick={() => {
              setIsLoading(true);
              Auth.verifyEmail({
                code,
              })
                .then((res) => {
                  if (res) {
                    navigate('/');
                  }
                })
                .catch((err) => {
                  toast.error(
                    getMessage(
                      `${err.response.data?.error ?? err.toString()}: ${
                        err.response.data?.message ?? ''
                      }`
                    )
                  );
                  console.error(err.response.data?.message ?? err);
                })
                .finally(() => setIsLoading(false));
            }}
          >
            Submit
          </button>
        </div>
        <p tw="pt-4 text-base text-center">
          Didn't receive a code?&nbsp;
          <button
            tw="text-[#35924A]"
            onClick={() => {
              setIsLoading(true);
              Auth.verifyEmailResend()
                .then((res) => {
                  if (res) {
                    toast.success('A new code sent!', {
                      icon: () => <img alt="send" src={iconCheck} />,
                    });
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
            Resend
          </button>
        </p>
        <p tw="pt-[20px] text-base text-center">
          <button tw="text-[#35924A]" onClick={() => navigate(-1)}>
            Back
          </button>
        </p>
      </div>
    </div>
  );
};

export default EmailVerifyPage;

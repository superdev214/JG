import '../../styles/common.css';

import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw from 'twin.macro';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';

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
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
      <div tw="px-5 w-full max-w-[460px]">
        <Link to="/">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-xl text-center text-[#857E9A]">
            Please verify your email
          </p>
        </Link>
        <div tw="pt-[50px]">
          <div tw="relative">
            <label
              htmlFor="username"
              tw="px-2 absolute left-4 -top-2.5 text-sm bg-[#070215]"
            >
              Verification Code
            </label>
            <input
              id="code"
              placeholder="Input code"
              tw="px-8 py-0 w-full h-[68px] text-base bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <div tw="pt-8">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
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
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div
                css={[
                  tw`absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg] overflow-hidden`,
                ]}
              />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              Submit
            </span>
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

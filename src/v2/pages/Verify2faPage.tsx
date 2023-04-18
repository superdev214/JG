import '../../styles/common.css';

import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';

const StyledCodeInput = styled.input`
  ${tw`px-0 py-0 w-[60px] h-[68px] text-[22px] text-center bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none`}
`;

const Verify2faPage = () => {
  const navigate = useNavigate();
  const [agreeChecked, setAgreeChecked] = useState<boolean>(false);
  const { setAuthData, setIsLoading } = useContext(UserContext);
  const [code0, setCode0] = useState<string>('');
  const [code1, setCode1] = useState<string>('');
  const [code2, setCode2] = useState<string>('');
  const [code3, setCode3] = useState<string>('');
  const [code4, setCode4] = useState<string>('');
  const [code5, setCode5] = useState<string>('');
  const ref: Array<HTMLInputElement | null> = [];

  const codeChanged = (
    value: string,
    next: HTMLInputElement | null,
    handleChanged: (value: string) => void
  ) => {
    handleChanged(value);
    if (next && value.length > 0) {
      next.focus();
      next.select();
    }
  };

  return (
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
      <div tw="px-5 w-full max-w-[460px]">
        <Link to="/">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-lg leading-[130%] text-center text-[#857E9A]">
            You should be receveid a 2FA code
            <br />
            on your phone
          </p>
        </Link>
        <div tw="pt-12 flex justify-between">
          <StyledCodeInput
            ref={(input) => (ref[0] = input)}
            autoFocus
            value={code0}
            onChange={(e) => codeChanged(e.target.value, ref[1], setCode0)}
          />
          <StyledCodeInput
            ref={(input) => (ref[1] = input)}
            value={code1}
            onChange={(e) => codeChanged(e.target.value, ref[2], setCode1)}
          />
          <StyledCodeInput
            ref={(input) => (ref[2] = input)}
            value={code2}
            onChange={(e) => codeChanged(e.target.value, ref[3], setCode2)}
          />
          <StyledCodeInput
            ref={(input) => (ref[3] = input)}
            value={code3}
            onChange={(e) => codeChanged(e.target.value, ref[4], setCode3)}
          />
          <StyledCodeInput
            ref={(input) => (ref[4] = input)}
            value={code4}
            onChange={(e) => codeChanged(e.target.value, ref[5], setCode4)}
          />
          <StyledCodeInput
            ref={(input) => (ref[5] = input)}
            value={code5}
            onChange={(e) => codeChanged(e.target.value, ref[0], setCode5)}
          />
        </div>
        <p tw="pt-4 text-base">
          <button
            tw="underline text-[#A237F5]"
            onClick={() => {
              navigate(-1);
            }}
          >
            Resend Vefication Code
          </button>
        </p>
        <div tw="pt-[26px]">
          <label className="container" tw="flex items-center text-base">
            Trust this device for 30 days
            <input
              checked={agreeChecked}
              type="checkbox"
              onChange={() => setAgreeChecked(!agreeChecked)}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        <div tw="pt-8">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
            onClick={() => {
              setIsLoading(true);
              Auth.verify2fa({
                userToken: `${code0}${code1}${code2}${code3}${code4}${code5}`,
              })
                .then((res) => {
                  if (res) {
                    toast.success(
                      'Your two-factor authentication was setup successfully.',
                      {
                        icon: () => <img alt="send" src={iconCheck} />,
                      }
                    );
                    setAuthData(res);
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
              Verify
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify2faPage;

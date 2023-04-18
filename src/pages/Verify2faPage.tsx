import '../styles/common.css';

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import iconCheck from '../assets/svgs/icon-check.svg';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

const StyledCodeInput = styled.input`
  ${tw`px-0 py-0 w-[60px] h-[68px] text-4xl text-center bg-[#1F2E54] border border-[#ffffff42] outline-none rounded-2xl`}
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
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[460px]">
        <header>
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            You should be receveid a 2FA code
            <br />
            on your phone
          </p>
        </header>
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
          <div tw="w-1" />
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
            css={[
              // tw`w-full h-[68px] capitalize font-semibold text-xl bg-[#8b8b8b] rounded-2xl`,
              // agreeChecked && tw`bg-[#35924A] hover:bg-[#246432]`,
              tw`w-full h-[68px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl`,
            ]}
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
            Verify
          </button>
        </div>
        <p tw="pt-4 text-base text-center">
          <button
            tw="text-[#35924A]"
            onClick={() => {
              navigate(-1);
            }}
          >
            Reset
          </button>{' '}
          Vefication Number Again
        </p>
      </div>
    </div>
  );
};

export default Verify2faPage;

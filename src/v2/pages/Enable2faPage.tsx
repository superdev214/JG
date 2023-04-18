import '../../styles/common.css';
import 'twin.macro';

import * as QRCode from 'qrcode';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { I2faSecret } from '../../type';
import { getMessage } from '../../utils';
import imgLogo from '../assets/images/logo-light.png';
import iconSend from '../assets/svgs/icon-send.svg';

const Enable2faPage = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(UserContext);
  const [secret, setSecret] = useState<I2faSecret | null>(null);
  const [qrPic, setQrPic] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    Auth.enable2fa()
      .then((res) => {
        if (res) {
          setSecret(res);
        }
      })
      .catch((err) => {
        toast.error(getMessage(err.response.data?.message ?? err.toString()), {
          icon: () => <img alt="send" src={iconSend} />,
        });
        console.error(err.response.data?.message ?? err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (secret?.otpauth_url) {
      QRCode.toDataURL(secret.otpauth_url, (err: any, url: string) => {
        setQrPic(url);
      });
    }
  }, [secret]);

  return (
    <div tw="py-[100px] min-h-[100vh] flex justify-center items-center bg-no-repeat bg-bottom bg-contain bg-auth-mobile md:bg-auth-desktop">
      <div tw="px-5 w-full max-w-[460px]">
        <header tw="pb-10">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[162px]" />
          <p tw="pt-8 text-lg leading-[130%] text-center text-[#857E9A]">
            Easily setup your 2 Factor
            <br />
            Authentication by scanning the QR
            <br />
            code below in your authenticator app.
          </p>
        </header>
        <div tw="py-6 w-full flex flex-col items-center text-center">
          {qrPic ? (
            <img alt="qr" src={qrPic} tw="w-[180px] rounded-lg" />
          ) : null}
        </div>
        <p tw="pt-4 text-base text-center text-[#7f8592]">
          If you are unable to scan the QR code please enter this code to
          manually into the app:
        </p>
        <p tw="mx-auto pt-4 max-w-[88%] break-words font-medium tracking-[0.1em] text-2xl uppercase text-center text-white">
          {secret?.base32}5235523
        </p>
        <div tw="pt-8 text-center">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
            onClick={() => {
              navigate('/verify-2fa');
            }}
          >
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg] overflow-hidden" />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              Continue
            </span>
          </button>
          <button
            tw="mx-auto pt-6 pb-1 inline-block w-auto text-[16px] tracking-[0.22em] leading-[23px] uppercase whitespace-nowrap text-white"
            onClick={() => {
              navigate('/');
            }}
          >
            <span>Skip &gt;&gt;</span>
            <div tw="pt-1 w-full h-[3px] skew-x-[-45deg] bg-[#D2193A]" />
          </button>
        </div>
        <p tw="mx-auto pt-8 max-w-[272px] text-base text-center text-[#857E9A]">
          You can set this up later in your user dashboard as well
        </p>
      </div>
    </div>
  );
};

export default Enable2faPage;

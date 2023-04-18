import '../styles/common.css';
import 'twin.macro';

import * as QRCode from 'qrcode';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Auth } from '../api/api';
import imgLogo from '../assets/images/logo-light.png';
import iconSend from '../assets/svgs/icon-send.svg';
import { UserContext } from '../contexts/UserContext';
import { I2faSecret } from '../type';
import { getMessage } from '../utils';

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
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[460px]">
        <header tw="pb-10">
          <img alt="logo" src={imgLogo} tw="mx-auto w-full max-w-[203px]" />
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            Easily setup your 2 Factor
            <br />
            Authentication by scanning the QR
            <br />
            code below in your authenticator app.
          </p>
        </header>
        <div tw="py-[50px] w-full flex flex-col items-center text-center bg-[#1F2E54] border border-[#fff4] rounded-2xl">
          {qrPic ? (
            <img alt="qr" src={qrPic} tw="w-[180px] rounded-lg" />
          ) : null}
          <p tw="pt-7 max-w-[88%] break-words font-medium text-xl uppercase">
            {secret?.base32}
          </p>
        </div>
        <p tw="pt-4 text-xl text-center text-[#7f8592]">
          If you are unable to scan the QR code please enter this code to
          manually into the app
        </p>
        <div tw="pt-8 flex flex-col gap-6">
          <button
            tw="w-full h-[68px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
            onClick={() => {
              navigate('/verify-2fa');
            }}
          >
            Continue
          </button>
          <button
            tw="w-full h-[68px] capitalize font-semibold text-xl bg-[#1F2E54] hover:bg-[#1F2E54] rounded-2xl"
            onClick={() => {
              navigate('/');
            }}
          >
            Skip
          </button>
        </div>
        <p tw="pt-4 italic text-xl text-center text-[#7f8592]">
          You can set this up later in your user dashboard as well
        </p>
      </div>
    </div>
  );
};

export default Enable2faPage;

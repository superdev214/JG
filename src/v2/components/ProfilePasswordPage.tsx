import '../../styles/common.css';
import 'twin.macro';
import './slider.css';

import * as QRCode from 'qrcode';
import { useContext, useEffect, useMemo, useState } from 'react';
import {useLocation} from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import { Auth } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { I2faSecret } from '../../type';
import { getMessage } from '../../utils';
import iconCheck from '../assets/svgs/icon-check.svg';
import iconSend from '../assets/svgs/icon-send.svg';
import TextInputOutlined from './TextInputOutlined';

const StyledCodeInput = styled.input`
  ${tw`px-0 py-0 w-[44px] h-[56px] md:w-[60px] md:h-[68px] text-4xl text-center bg-transparent border border-[rgba(255, 255, 255, 0.3)] focus:border-[#A237F5] outline-none mr-[10px]`}
`;

const ProfilePasswordPage = () => {
  const { authData, setAuthData, setIsLoading } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const [scanned, setScanned] = useState<boolean>(false);

  const location = useLocation()

  const [twitchAccessToken, setTwitchAccessToken] = useState<string>( '' );

  useEffect(() => {

    setTwitchAccessToken(() => {

      let hash = new URLSearchParams(location.hash.replace('#', ''))
      let access_token = hash.getAll('access_token')
      console.log('-------------access_token:', access_token)

      return access_token.length ? access_token[0] : ''
    })

  }, [location])

  const [shown2FAConfirm, show2FAConfirm] = useState<boolean>(false);

  const [secret, setSecret] = useState<I2faSecret | null>(null);
  const [qrPic, setQrPic] = useState<string | null>(null);

  const TFAStatus = useMemo(() => {
    return authData?.user?.verification?.totp?.enabled || false;
  }, [authData]);

  const [agreeChecked, setAgreeChecked] = useState<boolean>(false);
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

  useEffect(() => {
    if (
      code0 === '' ||
      code1 === '' ||
      code2 === '' ||
      code3 === '' ||
      code4 === '' ||
      code5 === '' ||
      !agreeChecked
    ) {
      return;
    }
    setIsLoading(true);
    if (!TFAStatus) {
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
            show2FAConfirm(false);
            setCode0('');
            setCode1('');
            setCode2('');
            setCode3('');
            setCode4('');
            setCode5('');
          }
        })
        .catch((err) => {
          toast.error(getMessage(err.response.data?.message ?? err.toString()));
          console.error(err.response.data?.message ?? err);
        })
        .finally(() => setIsLoading(false));
    } else {
      Auth.disable2fa({
        userToken: `${code0}${code1}${code2}${code3}${code4}${code5}`,
      })
        .then((res) => {
          if (res) {
            toast.success('Your two-factor authentication was deactivated.', {
              icon: () => <img alt="send" src={iconCheck} />,
            });
            setAuthData(res);
            show2FAConfirm(false);
            setCode0('');
            setCode1('');
            setCode2('');
            setCode3('');
            setCode4('');
            setCode5('');
          }
        })
        .catch((err) => {
          toast.error(getMessage(err.response.data?.message ?? err.toString()));
          console.error(err.response.data?.message ?? err);
        })
        .finally(() => setIsLoading(false));
    }
  }, [
    TFAStatus,
    code0,
    code1,
    code2,
    code3,
    code4,
    code5,
    agreeChecked,
    setIsLoading,
    setAuthData,
  ]);

  useEffect(() => {
    if (secret?.otpauth_url) {
      QRCode.toDataURL(secret.otpauth_url, (err: any, url: string) => {
        setQrPic(url);
      });
    }
  }, [secret]);

  const handle2FA = () => {
    if (TFAStatus) {
      show2FAConfirm(true);
      setScanned(true);
    } else {
      if (!shown2FAConfirm) {
        setIsLoading(true);
        Auth.enable2fa()
          .then((res) => {
            if (res) {
              setSecret(res);
              show2FAConfirm(true);
            }
          })
          .catch((err) => {
            toast.error(
              getMessage(err.response.data?.message ?? err.toString()),
              {
                icon: () => <img alt="send" src={iconSend} />,
              }
            );
            console.error(err.response.data?.message ?? err);
          })
          .finally(() => setIsLoading(false));
      }
    }
  };

  const handleCancelVerify = () => {
    if (!TFAStatus) {
      setScanned(false);
    } else {
      show2FAConfirm(false);
    }
  };

  const getTwitchURL = () => {
    let url = 'https://id.twitch.tv/oauth2/authorize?'

    let query = new URLSearchParams({
      client_id : process.env.REACT_APP_TWITCH_CLIENT_ID as string,
      redirect_uri: process.env.REACT_APP_TWITCH_REDIRECT_URL as string,
      response_type: 'token',
      scope: process.env.REACT_APP_TWITCH_SCOPE as string
    }).toString()

    return url + query
  }


  return (
    <div tw="py-16 max-w-[600px]">
      <h3 tw="pb-[38px] text-2xl leading-[130%]">Change Password</h3>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextInputOutlined
          id="old-password"
          label="Current Password"
          placeholder="*****"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextInputOutlined
          id="new-password"
          label="New Password"
          placeholder="*****"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button
        tw="relative mt-10 w-full max-w-[284px] h-[55px]"
        onClick={() => {
          setIsLoading(true);
          Auth.changePassword({
            currentPwd: oldPassword,
            email: authData?.user.email ?? '',
            newPwd: newPassword,
          })
            .then((res) => {
              if (res) {
                toast.success('New password has been set.', {
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
        <div tw="absolute left-0 top-0 w-full h-full skew-x-[-15deg] bg-[#D2193A] z-10" />
        <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase z-20">
          Save Changes
        </span>
      </button>
      <div tw="mt-[48px] pt-[48px] flex justify-between items-center border-t border-[rgba(255, 255, 255, 0.3)]">
        <h3 tw="text-2xl leading-[130%]">Two Factor Authentication</h3>
        <label className="switch">
          <input checked={TFAStatus} type="checkbox" onChange={handle2FA} />
          <span className="check-slider round" />
        </label>
      </div>
      <p tw="pt-4 text-[#857E9A] text-[14px] md:text-[16px]">
        Add an extra layer of security to your account by requiring access to
        your profile when you log in. You will need an app like Google
        Authenticator to enable it
      </p>


      <div>
        <div tw="pt-[69px] pb-[14px] flex justify-between items-center">
          <h3 tw="text-2xl leading-[130%]">Twitch Account</h3>
          <label >
            <a href={getTwitchURL()}>
              <button
                tw="relative w-[199px] h-[39px] hover:opacity-70"
              >
                <div tw="absolute left-0 top-0 w-full h-full -skew-x-12 bg-[#D2193A] z-10" />
                <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.1em] z-20">
                Connect
              </span>
              </button>
            </a>
          </label>
        </div>
        <p tw="text-[#F6FAFF88] text-[14px] md:text-[16px]">
          Connect your Twitch account with Joystick.
        </p>
      </div>

      {shown2FAConfirm && (
        <>
          {!scanned ? (
            <>
              <div tw="py-10 w-full flex flex-col items-center text-center">
                {qrPic ? (
                  <img alt="qr" src={qrPic} tw="w-[180px] rounded-lg" />
                ) : null}
                <p tw="pt-7 max-w-[360px] break-words font-medium text-xl uppercase">
                  {secret?.base32}
                </p>
              </div>
              <p tw="text-[14px] md:text-[16px] text-[#857E9A]">
                If you are unable to scan the QR code please enter this code to
                manually into the app
              </p>
              <button
                tw="relative mt-10 w-full max-w-[284px] h-[55px]"
                onClick={() => setScanned(true)}
              >
                <div tw="absolute left-0 top-0 w-full h-full skew-x-[-15deg] bg-[#D2193A] z-10" />
                <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase z-20">
                  Continue
                </span>
              </button>
            </>
          ) : (
            <>
              <div tw="pt-12 flex justify-between md:justify-start items-center">
                <StyledCodeInput
                  ref={(input) => (ref[0] = input)}
                  autoFocus
                  value={code0}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[1], setCode0)
                  }
                />
                <StyledCodeInput
                  ref={(input) => (ref[1] = input)}
                  value={code1}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[2], setCode1)
                  }
                />
                <StyledCodeInput
                  ref={(input) => (ref[2] = input)}
                  value={code2}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[3], setCode2)
                  }
                />
                <StyledCodeInput
                  ref={(input) => (ref[3] = input)}
                  value={code3}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[4], setCode3)
                  }
                />
                <StyledCodeInput
                  ref={(input) => (ref[4] = input)}
                  value={code4}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[5], setCode4)
                  }
                />
                <StyledCodeInput
                  ref={(input) => (ref[5] = input)}
                  value={code5}
                  onChange={(e) =>
                    codeChanged(e.target.value, ref[0], setCode5)
                  }
                />
                <span
                  tw="ml-[24px] text-[#D2193A] text-[16px] tracking-[0.22em] uppercase cursor-pointer hidden md:block"
                  onClick={handleCancelVerify}
                >
                  Cancel
                </span>
              </div>
              <p tw="pt-4 text-[14px] md:text-[16px] text-[#857E9A]">
                Enter the 6-digit code from Google Authenticator
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePasswordPage;

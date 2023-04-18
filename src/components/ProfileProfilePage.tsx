import '../styles/common.css';
import 'twin.macro';
import './slider.css';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { UserApi } from '../api/api';
import iconCheck from '../assets/svgs/icon-check.svg';
import { UserContext } from '../contexts/UserContext';

const ProfileEdit = () => {
  const { authData, setAuthData } = useContext(UserContext);

  const [email, setEmail] = useState(authData?.user.email);
  const [contactNumber, setContactNumber] = useState(
    authData?.user.contactNumber
  );
  const [discordUsername, setDiscordUsername] = useState(
    authData?.user.discordUsername
  );
  const [twitterUsername, setTwitterUsername] = useState(
    authData?.user.twitterUsername
  );
  const [inGameUsername, setInGameUsername] = useState(
    authData?.user.inGameUsername
  );
  const [walletAddress, setWalletAddress] = useState(
    authData?.user.walletAddress
  );

  const handleSubmit = () => {
    UserApi.update(authData?.user._id as string, {
      contactNumber,
      discordUsername,
      email,
      inGameUsername,
      twitterUsername,
      walletAddress,
    })
      .then((res) => {
        toast.success('Profile updated', {
          icon: () => <img alt="send" src={iconCheck} />,
        });
        if (authData) {
          setAuthData({
            ...authData,
            user: res,
          });
          window.localStorage.setItem(
            'auth',
            JSON.stringify({
              ...authData,
              user: res,
            })
          );
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <div tw="mx-auto py-16 max-w-[600px]">
      <h3 tw="pb-7 font-semibold text-2xl">Profile</h3>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          <div>
            Email Address <span tw="text-[#FF0000]">*</span>
          </div>
          <input
            required
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          Phone
          <input
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </label>
      </div>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          Discord Username
          <input
            required
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.target.value)}
          />
        </label>
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          Twitter Username
          <input
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={twitterUsername}
            onChange={(e) => setTwitterUsername(e.target.value)}
          />
        </label>
      </div>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          In-Game Username
          <input
            required
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={inGameUsername}
            onChange={(e) => setInGameUsername(e.target.value)}
          />
        </label>
        <label tw="text-[#A1A8BC] flex flex-col gap-2">
          Wallet Address
          <input
            tw="px-6 w-full h-[68px] border border-[#fff4] bg-[#1F2E54] rounded-2xl"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </label>
      </div>
      <button
        tw="w-full h-[68px] font-bold text-xl bg-[#35924A] rounded-xl mt-8"
        onClick={handleSubmit}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileEdit;

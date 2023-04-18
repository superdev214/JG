import '../../styles/common.css';
import 'twin.macro';
import './slider.css';

import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { UserApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import iconCheck from '../assets/svgs/icon-check.svg';
import TextInputOutlined from './TextInputOutlined';

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
    <div tw="py-16 max-w-[600px]">
      <h3 tw="pb-7 text-2xl">Profile</h3>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextInputOutlined
          required
          id="email"
          label="Email Address"
          type="email"
          value={email ?? ''}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInputOutlined
          required
          id="phone"
          label="Phone"
          type="phone"
          value={contactNumber ?? ''}
          onChange={(e) => setContactNumber(e.target.value)}
        />
      </div>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <TextInputOutlined
          required
          id="discord"
          label="Discord Username"
          type="text"
          value={discordUsername ?? ''}
          onChange={(e) => setDiscordUsername(e.target.value)}
        />
        <TextInputOutlined
          id="twitter"
          label="Twitter Username"
          type="text"
          value={twitterUsername ?? ''}
          onChange={(e) => setTwitterUsername(e.target.value)}
        />
      </div>
      <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <TextInputOutlined
          id="in-game"
          label="In-Game Username"
          type="text"
          value={inGameUsername ?? ''}
          onChange={(e) => setInGameUsername(e.target.value)}
        />
        <TextInputOutlined
          id="wallet"
          label="Wallet Address"
          type="text"
          value={walletAddress ?? ''}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
      </div>
      <button
        tw="relative mt-12 w-full sm:max-w-[284px] h-[55px]"
        onClick={handleSubmit}
      >
        <div tw="absolute left-0 top-0 w-full h-full skew-x-[-15deg] bg-[#D2193A] z-10" />
        <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase z-20">
          Save Changes
        </span>
      </button>
    </div>
  );
};

export default ProfileEdit;

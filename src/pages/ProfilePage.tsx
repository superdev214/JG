import '../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useMemo, useState } from 'react';

import { UserApi } from '../api/api';
import iconProfile from '../assets/svgs/profile-banner-icon.svg';
import iconRefresh from '../assets/svgs/refresh.svg';
import ProfileHistoryPage from '../components/ProfileHistoryPage';
import ProfilePasswordPage from '../components/ProfilePasswordPage';
import ProfileProfilePage from '../components/ProfileProfilePage';
import ProfileTiersPage from '../components/ProfileTiersPage';
import { UserContext } from '../contexts/UserContext';
import { useWeb3Provider } from '../hooks';
import { useJoyBalance } from '../hooks/useJoyBalance';

const tabs = [
  { key: 'order-history', title: 'Order History' },
  { key: 'tiers', title: 'Tiers' },
  { key: 'security', title: 'Security' },
  { key: 'profile', title: 'Profile' },
];

const ProfilePage = (props: { tab: string }) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    props.tab ?? 'order-history'
  );
  const { account, activate, active, deactivate } = useWeb3Provider();
  const [joyBalance, tierLv, fetchJoyBalance, tiers] = useJoyBalance();

  const roundedJoyBalance = useMemo(() => {
    return Math.floor(joyBalance || 0);
  }, [joyBalance]);

  const { authData, setAuthData } = useContext(UserContext);

  useEffect(() => {
    if (account) {
      if (authData?.user.walletAddress !== account) {
        UserApi.update(authData?.user._id as string, {
          walletAddress: account,
        }).then((res) => {
          if (authData) {
            setAuthData({
              ...authData,
              user: res,
            });
          }
        });
      }
    }
  }, [account, authData?.user.walletAddress]);
  return (
    <div tw="py-0 md:py-8 min-h-[calc(100vh - 228px)] bg-[#02091B]">
      <div tw="mx-auto px-0 md:px-2 w-full max-w-[1220px]">
        <div
          css={{ backgroundImage: 'url(/images/profile-bg.jpg)' }}
          tw="px-7 w-full md:h-[198px] gap-8 flex items-center bg-cover bg-center md:rounded-2xl flex-col md:flex-row py-16 md:py-0"
        >
          <img alt="robot" src={iconProfile} />

          {active ? (
            <>
              <div tw="flex flex-col gap-4 w-[295px]">
                <div tw="flex ml-auto mr-auto md:ml-0">
                  <span tw="text-[20px] md:text-[24px] text-center">
                    {joyBalance ? joyBalance.toLocaleString() : 0} $JOY
                  </span>
                  <span
                    tw="w-[20px] h-[17px] ml-2 mt-[3px]"
                    onClick={fetchJoyBalance}
                  >
                    <img alt="refresh" src={iconRefresh} tw="cursor-pointer" />
                  </span>
                </div>
                <div>
                  <div tw="w-full bg-[#0C1630] rounded-full h-2.5">
                    <div
                      style={{
                        width: joyBalance
                          ? joyBalance >= 5000
                            ? '100%'
                            : `${(joyBalance / 5000) * 100}%`
                          : 0,
                      }}
                      tw="bg-[#35924A] h-2.5 rounded-full"
                    ></div>
                  </div>
                </div>
                <div tw="flex justify-between text-[16px]">
                  <span>Tier Level {tierLv}</span>
                  <span>
                    {roundedJoyBalance || 0} of{' '}
                    {tierLv === 0 ? 0 : tiers[tierLv - 1].max} tokens
                  </span>
                </div>
              </div>
              <button
                tw="w-[190px] h-14 font-semibold bg-[#35924A] rounded-2xl"
                onClick={deactivate}
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <button
                tw="w-[190px] h-14 font-semibold bg-[#35924A] rounded-2xl"
                onClick={() => activate('Injected')}
              >
                Connect Wallet
              </button>
              <p tw="max-w-[224px]">
                Please connect your wallet to view your tier level
              </p>
            </>
          )}
        </div>
        <ul tw="flex md:gap-16 border-b border-[#888E9D] px-10 md:px-0 justify-between md:justify-start">
          {tabs.map((item) => (
            <li
              key={item.key}
              css={{
                borderColor:
                  item.key === selectedTab ? '#35924A' : 'transparent',
                fontWeight: item.key === selectedTab ? 600 : 400,
              }}
              tw="pt-[27px] md:pt-8 pb-[27px] md:pb-7 border-b-[7px] cursor-pointer text-[14px]"
              onClick={() => setSelectedTab(item.key)}
            >
              {item.title}
            </li>
          ))}
        </ul>
        <div tw="px-10 md:px-0 pb-10">
          {selectedTab === 'order-history' && <ProfileHistoryPage />}
          {selectedTab === 'tiers' && <ProfileTiersPage />}
          {selectedTab === 'security' && <ProfilePasswordPage />}
          {selectedTab === 'profile' && <ProfileProfilePage />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

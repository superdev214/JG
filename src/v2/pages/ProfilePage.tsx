import '../../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useMemo, useState } from 'react';

import { UserApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { useWeb3Provider } from '../../hooks';
import { useJoyBalance } from '../../hooks/useJoyBalance';
import imgBottomBar from '../assets/images/bottom-bar.png';
import imgBar from '../assets/images/profile-side-bar.png';
import iconRefresh from '../assets/svgs/refresh.svg';
import ProfileHistoryPage from '../components/ProfileHistoryPage';
import ProfilePasswordPage from '../components/ProfilePasswordPage';
import ProfileProfilePage from '../components/ProfileProfilePage';
import ProfileTiersPage from '../components/ProfileTiersPage';

const tabs: { [key: string]: string }[] = [
  { key: 'order-history', title: 'Order History' },
  { key: 'tiers', title: 'Tiers' },
  { key: 'security', title: 'Security' },
  { key: 'profile', title: 'Profile' },
];

const ProfilePage = (props: { tab: string }) => {
  const [selectedTab, setSelectedTab] = useState<string>(
    props.tab ?? 'order-history'
  );
  const [tabDropdown, setTabDropdown] = useState<boolean>(false);

  const { account, activate, active, deactivate } = useWeb3Provider();
  const [joyBalance, tierLv, fetchJoyBalance, tiers] = useJoyBalance();

  const roundedJoyBalance = useMemo(() => {
    return Math.floor(joyBalance || 0);
  }, [joyBalance]);

  const { authData, setAuthData } = useContext(UserContext);

  const getTitleByKey = (key: string): string => {
    const found = tabs.find((item) => item.key === key);
    return found?.title ?? '';
  };

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
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-center bg-cover"
    >
      <div tw="h-[88px]" />
      <div tw="py-0 md:py-8 min-h-[calc(100vh - 228px)] border-t border-[#393544]">
        <div tw="mx-auto px-0 md:px-8 w-full max-w-[1280px]">
          <div tw="relative px-7 w-full h-[216px] md:h-[152px] flex flex-col justify-center items-center gap-6 bg-[rgba(255, 255, 255, 0.1)]">
            <img
              alt="bar"
              src={imgBar}
              tw="hidden md:block absolute left-0 top-0 h-full translate-x-[-50%]"
            />
            <img
              alt="bar"
              src={imgBar}
              tw="hidden md:block absolute right-0 top-0 h-full translate-x-[50%] rotate-180"
            />
            <img
              alt="bar"
              src={imgBottomBar}
              tw="block md:hidden absolute left-0 bottom-0 w-full translate-y-[50%]"
            />

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
                      <img
                        alt="refresh"
                        src={iconRefresh}
                        tw="cursor-pointer"
                      />
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
                <p tw="max-w-[268px] md:max-w-none text-[16px] md:text-[18px] leading-[130%] uppercase text-center text-[#857E9A]">
                  Please connect your wallet to view your tier level
                </p>
                <button
                  tw="relative w-[199px] h-[39px] hover:opacity-70"
                  onClick={() => activate('Injected')}
                >
                  <div tw="absolute left-0 top-0 w-full h-full -skew-x-12 bg-[#D2193A] z-10" />
                  <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.1em] z-20">
                    Connect Wallet
                  </span>
                </button>
              </>
            )}
          </div>
          <ul tw="hidden md:flex px-10 md:px-0 gap-10 justify-start items-center">
            {tabs.map((item) => (
              <li
                key={item.key}
                css={item.key === selectedTab ? {} : { opacity: 0.5 }}
                tw="pt-[52px] pb-1.5 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTab(item.key)}
              >
                <span tw="pb-1.5 block text-[16px] tracking-[0.1em] leading-[23px] uppercase">
                  {item.title}
                </span>
                <div
                  css={{
                    backgroundColor:
                      item.key === selectedTab ? '#fff' : 'transparent',
                  }}
                  tw="w-full h-0.5 skew-x-[-45deg]"
                />
              </li>
            ))}
          </ul>
          <div tw="relative px-4 pt-16 inline-block md:hidden">
            <div
              tw="pb-1.5 flex justify-between items-center gap-3 cursor-pointer"
              onClick={() => setTabDropdown(true)}
            >
              <span tw="text-[16px] tracking-[0.1em] uppercase">
                {getTitleByKey(selectedTab)}
              </span>
              <div tw="pt-1.5">
                <div tw="w-1 h-1 border-4 border-t-white border-l-transparent border-r-transparent border-b-transparent" />
              </div>
            </div>
            <div tw="w-full h-0.5 bg-white skew-x-[-45deg]" />
            {tabDropdown && (
              <>
                <div
                  tw="fixed left-0 top-0 w-full h-full z-20"
                  onClick={() => setTabDropdown(false)}
                />
                <ul tw="absolute left-4 top-[98px] bg-[#221b2e] z-30">
                  {tabs.map((item) => (
                    <li
                      key={item.key}
                      css={item.key === selectedTab ? {} : { opacity: 0.5 }}
                      tw="px-6 py-2 text-[16px] tracking-[0.1em] uppercase whitespace-nowrap text-center hover:bg-[#fff2] cursor-pointer"
                      onClick={() => {
                        setSelectedTab(item.key);
                        setTabDropdown(false);
                      }}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div tw="px-4 md:px-0 pb-10">
            {selectedTab === 'order-history' && <ProfileHistoryPage />}
            {selectedTab === 'tiers' && <ProfileTiersPage />}
            {selectedTab === 'security' && <ProfilePasswordPage />}
            {selectedTab === 'profile' && <ProfileProfilePage />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

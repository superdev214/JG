import '../../styles/common.css';
import 'twin.macro';
import './slider.css';

import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../../contexts/UserContext';
import { useJoyBalance } from '../../hooks/useJoyBalance';
import iconTier1 from '../assets/svgs/tier1.svg';
import iconTier2 from '../assets/svgs/tier2.svg';
import iconTier3 from '../assets/svgs/tier3.svg';
import iconTier4 from '../assets/svgs/tier4.svg';
import iconTier5 from '../assets/svgs/tier5.svg';

const tiers = [
  { icon: iconTier1, max: 1000, percentage: 5, tier: 1 },
  { icon: iconTier2, max: 2000, percentage: 10, tier: 2 },
  { icon: iconTier3, max: 3000, percentage: 15, tier: 3 },
  { icon: iconTier4, max: 4000, percentage: 20, tier: 4 },
  { icon: iconTier5, max: 5000, percentage: 25, tier: 5 },
];

const TierCard = (props: {
  tier: number;
  icon: string;
  percentage: number;
  max: number;
  current: { points: number; tier: number };
}) => {
  const calculatedPercentage = useMemo(() => {
    if (props.current.points >= props.max) return 100;
    return (100 * props.current.points) / props.max;
  }, [props]);

  return (
    <div
      css={{
        opacity: props.current.tier < props.tier ? 0.5 : 1,
      }}
      tw="relative w-[216px] h-[276px] bg-center bg-no-repeat bg-[rgba(255, 255, 255, 0.14)]"
    >
      <div tw="absolute left-4 top-6 flex justify-center text-center flex-col">
        <span tw="text-[16px] text-white">Tier Level {props.tier}</span>
      </div>
      <img
        alt=""
        src={props.icon}
        tw="absolute left-1/2 top-[46%] translate-x-[-50%] translate-y-[-50%] z-30"
      />
      <div tw="absolute left-4 right-4 bottom-[55px] h-2 bg-[rgba(255, 255, 255, 0.2)]">
        <div
          css={{ width: `${calculatedPercentage || 1}%` }}
          tw="h-2 bg-[#ED3550]"
        />
      </div>
      <div tw="absolute left-4 right-5 bottom-6 flex justify-between items-center">
        <span tw="text-[16px]">{props.percentage}%</span>
        <span tw="text-[16px]">
          {props.current.tier < props.tier ? 0 : props.current.points}/
          {props.max}
        </span>
      </div>
    </div>
  );
};

const ProfileTiersPage = () => {
  const navigate = useNavigate();
  const { setAuthData, setIsLoading, setLoggedIn } = useContext(UserContext);

  const [joyBalance, tierLv] = useJoyBalance();

  const roundedJoyBalance = useMemo(() => {
    if ((joyBalance || 0) > 5000) return 5000;
    return Math.floor(joyBalance || 0);
  }, [joyBalance]);

  return (
    <div tw="py-10">
      <div tw="flex justify-center items-center flex-wrap gap-[30px]">
        {tiers.map((item) => (
          <TierCard
            key={item.percentage}
            {...item}
            current={{ points: roundedJoyBalance, tier: tierLv }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileTiersPage;

import '../styles/common.css';
import 'twin.macro';
import './slider.css';

import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/UserContext';
import { useJoyBalance } from '../hooks/useJoyBalance';

const tiers = [
  { max: 1000, percentage: 5, tier: 1 },
  { max: 2000, percentage: 10, tier: 2 },
  { max: 3000, percentage: 15, tier: 3 },
  { max: 4000, percentage: 20, tier: 4 },
  { max: 5000, percentage: 25, tier: 5 },
];

const TierCard = (props: {
  tier: number;
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
        backgroundImage: `url(/images/tiers/lvl${props.tier}.svg)`,
        opacity: props.current.tier < props.tier ? 0.35 : 1,
      }}
      tw="relative w-[216px] h-[276px] bg-center bg-no-repeat bg-[#0C1938] rounded-2xl"
    >
      <div tw="pt-3 flex justify-center text-center flex-col">
        <span>{props.percentage}%</span>
        <span tw="font-semibold">Tier Level {props.tier}</span>
      </div>
      {props.current.tier < props.tier ? null : (
        <div tw="absolute left-1/2 bottom-14 translate-x-[-50%] w-[175px] h-2 bg-[#0B2360] rounded-lg">
          <div
            css={{ width: `${calculatedPercentage}%` }}
            tw="h-2 bg-[#35924A] rounded-lg"
          />
        </div>
      )}
      <div tw="absolute left-0 w-full bottom-5 text-center">
        {props.current.tier < props.tier ? 0 : props.current.points} of{' '}
        {props.max} tokens
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
    <div tw="py-9">
      <h3 tw="pb-9 font-semibold text-2xl">Tier Bonuses</h3>
      <div tw="flex justify-center items-center flex-wrap gap-7">
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

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useState } from 'react';

import { JOY_ABI, JOY_ADDRESS, JOY_DECIMALS } from '../constants/contracts';
import { useContract } from './useContract';
import { useIsMounted } from './useIsMounted';
import { useWeb3Provider } from './useWeb3Provider';

export const useJoyBalance = (): [
  number | undefined,
  number,
  () => void,
  any[]
] => {
  const tiers = [
    { max: 1000, percentage: 5, tier: 1 },
    { max: 2000, percentage: 10, tier: 2 },
    { max: 3000, percentage: 15, tier: 3 },
    { max: 4000, percentage: 20, tier: 4 },
    { max: 5000, percentage: 25, tier: 5 },
  ];

  const joyContract = useContract(JOY_ADDRESS, JOY_ABI, true);
  const { account } = useWeb3Provider();
  const [joyBalance, setJoyBalance] = useState<number>();
  const [tierLv, setTierLv] = useState<number>(1);
  const isMounted = useIsMounted();

  const fetchJoyBalance = useCallback(() => {
    if (account && joyContract) {
      joyContract
        .balanceOf(account)
        .then((value: BigNumber) => {
          if (isMounted.current) {
            const amount = parseFloat(
              formatUnits(value.toString(), JOY_DECIMALS)
            );
            const tier = Math.ceil(amount / 1000);
            setTierLv(tier > 5 ? 5 : tier);
            setJoyBalance(amount);
          }
        })
        .catch((error: any) => {
          if (isMounted.current) {
            console.error(error);
            setTierLv(0);
            setJoyBalance(undefined);
          }
        });
    }
  }, [account, joyContract, isMounted]);

  useEffect(() => {
    fetchJoyBalance();
  }, [fetchJoyBalance]);

  return [joyBalance, tierLv, fetchJoyBalance, tiers];
};

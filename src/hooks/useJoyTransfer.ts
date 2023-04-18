import { BigNumber } from 'ethers';
import { useCallback } from 'react';

import { JOY_ABI, JOY_ADDRESS } from '../constants/contracts';
import { useContract } from './useContract';

export const useJoyTransfer = (): [(amount: BigNumber) => any] => {
  const joyContract = useContract(JOY_ADDRESS, JOY_ABI, true);

  const transferJoy = useCallback(
    async (amount: BigNumber) => {
      let txPreHash: any;
      try {
        if (joyContract && amount) {
          txPreHash = await joyContract.transfer(
            '0x01611289351AFE2f3aF3Ff7B852c4ACE228b3660',
            amount
          );
          await txPreHash.wait();
        }
      } catch (error) {}
      return txPreHash;
    },
    [joyContract]
  );

  return [transferJoy];
};

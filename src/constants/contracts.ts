import JOYABI from './ABI/JOYToken.json'; // Joy is not deployed yet, should change by joy abi after its deployed

export const JOY_ABI = JOYABI;
export const JOY_ADDRESS = process.env.REACT_APP_JOY_ADDRESS || '';
export const JOY_DECIMALS = process.env.REACT_APP_JOY_DECIMALS || 18;

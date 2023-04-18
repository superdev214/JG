import '../../styles/common.css';
import 'twin.macro';

import { useContext } from 'react';
import { toast } from 'react-toastify';

import { UserApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { getMessage } from '../../utils';

const UnsubscribePage = () => {
  const { authData, setIsLoading } = useContext(UserContext);

  return (
    <div tw="min-h-[calc(100vh - 228px)] flex justify-center items-center">
      <div tw="px-5 w-full max-w-[640px]">
        <header>
          <p tw="pt-4 text-xl text-center text-[#857E9A]">
            To stop receiving emails from the Joystickgames, please click
            Unsubscribe button.
          </p>
        </header>
        <div tw="pt-8 flex justify-center">
          <button
            tw="relative w-full h-[55px] hover:opacity-70"
            onClick={() => {
              setIsLoading(true);
              UserApi.unsubscribe(authData?.user._id ?? '')
                .then(() => {
                  toast.info('Your accout has been unsubscribed.');
                })
                .catch((err) => {
                  toast.error(
                    getMessage(err.response.data?.error ?? err.toString())
                  );
                  console.error(err.response.data?.message ?? err);
                })
                .finally(() => setIsLoading(false));
            }}
          >
            <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[15deg] overflow-hidden z-10">
              <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg] overflow-hidden" />
            </div>
            <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] uppercase tracking-[0.22em] z-20">
              Unsubscribe
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;

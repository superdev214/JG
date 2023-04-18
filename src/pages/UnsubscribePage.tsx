import '../styles/common.css';
import 'twin.macro';

import { useContext } from 'react';
import { toast } from 'react-toastify';

import { UserApi } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import { getMessage } from '../utils';

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
            tw="w-full max-w-[320px] h-[56px] capitalize font-semibold text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
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
            Unsubscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsubscribePage;

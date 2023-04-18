import { toast } from 'react-toastify';

import ErrorIcon from '../assets/images/tx-error.png';
import SuccessIcon from '../assets/images/tx-success.png';
import WalletIcon from '../assets/images/tx-wallet.png';
import WalletDisconnectIcon from '../assets/images/tx-wallet-disconnect.png';
import WarningIcon from '../assets/svgs/warning.svg';

export type TOAST_TYPE =
  | 'SUCCESS'
  | 'ERROR'
  | 'WRONG_NETWORK'
  | 'WALLET_CONNECT'
  | 'WALLET_DISCONNECT'
  | 'LIMIT_EXCEED'
  | 'NO_ETHEREUMPROVIDER';

export const triggerToast = (type: TOAST_TYPE, extraContent?: string) => {
  if (type === 'SUCCESS') {
    toast.success('Successful Transaction', {
      hideProgressBar: true,
      icon: () => <img alt="" src={SuccessIcon} />,
    });
  }

  if (type === 'WALLET_CONNECT') {
    toast.success(
      <div>
        <p>Wallet Connected</p>
        <p className="Toastify__toast-submsg">
          Connected to wallet
          {extraContent ? (
            <>
              <br />
              {extraContent}
            </>
          ) : null}
        </p>
      </div>,
      {
        hideProgressBar: true,
        icon: () => <img alt="" src={WalletIcon} />,
        toastId: type,
      }
    );
  }

  if (type === 'WALLET_DISCONNECT') {
    toast.error(
      <div>
        <p>Wallet Disconnected</p>
        <p className="Toastify__toast-submsg">
          Disconnected from wallet
          {extraContent ? (
            <>
              <br />
              {extraContent}
            </>
          ) : null}
        </p>
      </div>,
      {
        hideProgressBar: true,
        icon: () => <img alt="" src={WalletDisconnectIcon} />,
      }
    );
  }

  if (type === 'ERROR') {
    toast.error(
      <p>
        Transaction Failed{' '}
        {extraContent ? (
          <>
            <br />
            {extraContent}
          </>
        ) : null}
      </p>,
      {
        hideProgressBar: true,
        icon: () => <img alt="" src={ErrorIcon} />,
      }
    );
  }

  if (type === 'WRONG_NETWORK') {
    toast.error(
      <div>
        <p>Wrong Network</p>
        <p className="Toastify__toast-submsg">Switch to Ethereum Network</p>
      </div>,
      {
        hideProgressBar: true,
        icon: () => <img alt="" src={ErrorIcon} />,
      }
    );
  }

  if (type === 'NO_ETHEREUMPROVIDER') {
    toast.error(
      <div>
        <p>No ethereum provider</p>
        <p className="Toastify__toast-submsg">
          Install Metamask or other provider for wallet connect
        </p>
      </div>,
      {
        hideProgressBar: true,
        icon: () => <img alt="" src={ErrorIcon} />,
      }
    );
  }

  if (type === 'LIMIT_EXCEED') {
    toast.error(
      <div>
        <p className="Toastify__toast-submsg">
          There are only ${extraContent} of tokens left for purchase in the
          private sale. Please change the amount to continue.
        </p>
      </div>,
      {
        hideProgressBar: true,
        icon: () => (
          <div
            css={{
              alignItems: 'center',
              background: 'white',
              borderRadius: '100%',
              display: 'inline-flex',
              height: 44,
              justifyContent: 'center',
              width: 44,
            }}
          >
            <img alt="" src={WarningIcon} />
          </div>
        ),
      }
    );
  }
};

export const updateToast = (type: TOAST_TYPE, extraContent?: string) => {
  if (type === 'WALLET_CONNECT') {
    toast.update(type, {
      render: (
        <div>
          <p>Wallet Connected</p>
          <p className="Toastify__toast-submsg">
            Connected to wallet
            <br />
            {extraContent}
          </p>
        </div>
      ),
    });
  }
};

import '../styles/common.css';

import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import requests from '../api/api';
import { UserContext } from '../contexts/UserContext';

const InfoPanel = styled.div`
  ${tw`mx-auto px-[44px] py-[36px]`}

  background: linear-gradient(0deg, #152348, #152348), #0c1938;
  box-shadow: 0px 34px 90px -20px rgba(10, 39, 97, 0.5),
    inset 0px 2px 13px rgba(0, 71, 255, 0.21);
  border-radius: 16px;
  border: 1px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(34, 90, 238, 0) 0%,
    #225aee 48.41%,
    rgba(34, 90, 238, 0) 100%
  );
`;

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const params = useParams();
  const [queryParams] = useSearchParams();
  const [paymentType, setPaymentType] = useState<string | null>();
  const { isFirstLoaded, loggedIn, setIsLoading } = useContext(UserContext);
  const [orderBrief, setOrderBrief] = useState<any>({});

  const paymentTypeLabel: any = {
    joy: '$JOY',
    paypal: 'PayPal',
    stripe: 'Pay With Card',
  };

  useEffect(() => {
    if (!isFirstLoaded || !loggedIn) return;
    let _pageType = null,
      _paymentType = null,
      _sessionId = null,
      _payerId = null;
    switch (params.success) {
      case 'stripe_success':
      case 'paypal_success':
      case 'joy_success':
        _pageType = 'success';
        break;
      case 'stripe_cancel':
      case 'paypal_cancel':
      case 'joy_cancel':
        _pageType = 'cancel';
        break;
      default:
    }
    if (_pageType) {
      _paymentType =
        (params.success || '').indexOf('stripe') >= 0 ? 'stripe' : _paymentType;
      _paymentType =
        (params.success || '').indexOf('paypal') >= 0 ? 'paypal' : _paymentType;
      _paymentType =
        (params.success || '').indexOf('joy') >= 0 ? 'joy' : _paymentType;
    }

    if (_pageType) {
      if (_paymentType === 'stripe') {
        _sessionId = queryParams.get('session_id');
      } else if (_paymentType === 'paypal') {
        _sessionId = queryParams.get('paymentId');
        _payerId = queryParams.get('PayerID');
      } else if (_paymentType === 'joy') {
        _sessionId = queryParams.get('session_id');
      }
    }
    setPaymentType(_paymentType);
    // setOrderBrief({ ...orderBrief, id: 'sss' });

    requests
      .get('order/byPaymentID?paymentId=' + _sessionId)
      .then((res: any[]) => {
        if (res) {
          setOrders(res);
          setOrderBrief({
            created: res[0]?.created,
            id: res[0]?.checkout_session?.slice(-4),
            total_price: res.reduce((carry, item) => {
              return carry + item.total_price;
            }, 0),
            total_price_joy: res.reduce((carry, item) => {
              return carry + item.total_price_joy;
            }, 0),
          });
        }
      })
      .finally(() => {});

    if (_pageType === 'success') {
      setIsLoading(true);
      requests
        .post('checkout/execute', {
          payload: { payer: _payerId, session: _sessionId },
          type: _paymentType,
        })
        .then((res) => {
          if (res) {
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
    }
  }, [isFirstLoaded]);

  return (
    <div tw="py-8 min-h-[calc(100vh - 228px)] bg-[#02091B]">
      <div tw="mx-auto px-2 w-full max-w-[1220px]">
        <h2 tw="py-10 font-semibold text-[32px]">Thank you for your order</h2>
        <div tw="flex flex-col sm:flex-row">
          <div tw="mr-[40px]">
            <div tw="text-[#A1A8BC] text-[16px] mb-[8px]">Order Number</div>
            <div tw="text-[#35924A] text-[20px] font-semibold">
              {orderBrief.id}
            </div>
          </div>
          <div tw="mr-[40px]">
            <div tw="text-[#A1A8BC] text-[16px] mb-[8px]">Date</div>
            <div tw="text-[#35924A] text-[20px] font-semibold">
              {orderBrief.created &&
                moment(orderBrief.created).format('MMM DD, YYYY')}
            </div>
          </div>
          <div tw="mr-[40px]">
            <div tw="text-[#A1A8BC] text-[16px] mb-[8px]">Total</div>
            {paymentType !== 'joy' ? (
              <div tw="text-[#35924A] text-[20px] font-semibold">
                $ {orderBrief.total_price}
              </div>
            ) : (
              <div tw="text-[#35924A] text-[18px] font-semibold">
                $JOY {orderBrief.total_price_joy?.toFixed(2)}
              </div>
            )}
          </div>
          <div>
            <div tw="text-[#A1A8BC] text-[16px] mb-[8px]">Payment Method</div>
            <div tw="text-[#35924A] text-[20px] font-semibold capitalize">
              {paymentTypeLabel[orderBrief.paymentType || paymentType]}
            </div>
          </div>
        </div>
        <div tw="h-[1px] bg-[#404F76] mb-[35px] mt-[31px] "></div>
        <h4 tw="pb-[41px] font-semibold text-[24px]">Order Details</h4>
        <InfoPanel>
          <div tw="pb-6 flex justify-between border-b border-[#404F76]">
            <span tw="w-6/12 text-[#A1A8BC]">Item</span>
            <span tw="w-2/12 text-[#A1A8BC]">Price</span>
            <span tw="w-2/12 text-[#A1A8BC]">Quantity</span>
            <span tw="w-2/12 text-[#A1A8BC]">Subtotal</span>
          </div>
          {orders.map((order) => (
            <div
              key={order._id}
              tw="h-[90px] flex justify-between items-center border-b border-[#404F76]"
            >
              <span
                css={{
                  backgroundImage: `url(${order.product.axie.image})`,
                  backgroundPositionX: -20,
                }}
                tw="pl-[78px] w-6/12 h-[80px] flex items-center bg-no-repeat bg-contain"
              >
                {order.product.product_name}
              </span>
              {paymentType !== 'joy' ? (
                <span tw="w-2/12 text-[#A1A8BC]">
                  ${(order.total_price / (order.quantity || 1)).toFixed(2)}
                </span>
              ) : (
                <span tw="w-2/12 text-[#A1A8BC]">
                  $JOY{' '}
                  {(order.total_price_joy / (order.quantity || 1)).toFixed(2)}
                </span>
              )}
              <span tw="w-2/12 text-[#A1A8BC]">{order.quantity} month</span>
              {paymentType !== 'joy' ? (
                <span tw="w-2/12 font-semibold text-2xl">
                  $ {order.total_price.toFixed(2)}
                </span>
              ) : (
                <span tw="w-2/12 font-semibold text-xl">
                  $JOY {order.total_price_joy.toFixed(2)}
                </span>
              )}
            </div>
          ))}
          <div tw="pt-[55px] flex justify-end items-center">
            <button
              tw="px-10 h-[68px] font-bold text-xl bg-[#35924A] rounded-xl"
              onClick={() => navigate('/game')}
            >
              Continue Shopping
            </button>
          </div>
        </InfoPanel>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

import '../../styles/common.css';

import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import requests from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import imgBarDesktop from '../assets/images/cart-bg_desktop.png';
import imgBarMobile from '../assets/images/cart-bg_mobile.png';

const InfoPanel = styled.div`
  ${tw`relative mx-auto px-[40px] py-[36px] bg-[rgba(255, 255, 255, 0.1)]`}
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
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-top bg-cover"
    >
      <div tw="h-[88px]" />
      <div tw="pt-12 pb-8 min-h-[calc(100vh - 228px)] border-t border-[#393544]">
        <div tw="mx-auto px-2 w-full max-w-[1220px]">
          <h2 tw="pb-[56px] font-lumadFree text-[24px] leading-[120%]">
            Thank you for your order
          </h2>
          <div tw="pb-[79px] grid grid-cols-2 md:flex">
            <div tw="mr-[40px]">
              <div tw="text-[#A1A8BC] text-[20px] mb-[8px]">Order Number</div>
              <div tw="text-white text-[24px]">{orderBrief.id}</div>
            </div>
            <div tw="mr-[40px]">
              <div tw="text-[#A1A8BC] text-[20px] mb-[8px]">Date</div>
              <div tw="text-white text-[24px]">
                {orderBrief.created &&
                  moment(orderBrief.created).format('MMM DD, YYYY')}
              </div>
            </div>
            <div tw="mr-[40px]">
              <div tw="text-[#A1A8BC] text-[20px] mb-[8px]">Total</div>
              {paymentType !== 'joy' ? (
                <div tw="text-white text-[24px]">
                  $ {orderBrief.total_price}
                </div>
              ) : (
                <div tw="text-white text-[24px]">
                  $JOY {orderBrief.total_price_joy?.toFixed(2)}
                </div>
              )}
            </div>
            <div>
              <div tw="text-[#A1A8BC] text-[20px] mb-[8px]">Payment Method</div>
              <div tw="text-white text-[24px] capitalize">
                {paymentTypeLabel[orderBrief.paymentType || paymentType]}
              </div>
            </div>
          </div>
          <InfoPanel>
            <img
              alt="bar"
              src={imgBarDesktop}
              tw="hidden md:block absolute left-0 top-0 w-full translate-y-[-50%]"
            />
            <img
              alt="bar"
              src={imgBarMobile}
              tw="block md:hidden absolute left-0 top-0 w-full translate-y-[-50%]"
            />
            <h4 tw="pb-[40px] text-[20px] uppercase">Order Details</h4>
            <div tw="pb-6 flex justify-between border-b border-[rgba(255, 255, 255, 0.3)]">
              <span tw="w-6/12 text-base uppercase text-[#A1A8BC]">Item</span>
              <span tw="w-2/12 text-base uppercase text-[#A1A8BC]">Price</span>
              <span tw="w-2/12 text-base uppercase text-[#A1A8BC]">
                Quantity
              </span>
              <span tw="w-2/12 text-base uppercase text-right text-[#A1A8BC]">
                Total
              </span>
            </div>
            {orders.map((order) => (
              <div
                key={order._id}
                tw="h-[90px] flex justify-between items-center border-b border-[rgba(255, 255, 255, 0.3)]"
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
            <div tw="pt-[60px] md:pt-0 w-full max-w-[433px] md:absolute right-0 bottom-[-55px] flex justify-end items-center">
              <button
                tw="relative w-full h-[55px]"
                onClick={() => navigate('/game')}
              >
                <div tw="absolute left-0 top-0 w-full h-full overflow-hidden origin-top skew-x-[-15deg] md:skew-x-0 z-10">
                  <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[27deg] md:skew-x-[15deg] bg-[#D2193A]" />
                </div>
                <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase text-white z-30">
                  Continue Shopping
                </span>
              </button>
            </div>
          </InfoPanel>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

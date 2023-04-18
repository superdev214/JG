import '../../styles/common.css';

import { parseUnits } from 'ethers/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import requests, { Auth } from '../../api/api';
import { JOY_DECIMALS } from '../../constants/contracts';
import { UserContext } from '../../contexts/UserContext';
import { useWeb3Provider } from '../../hooks';
import { useJoyBalance } from '../../hooks/useJoyBalance';
import { useJoyTransfer } from '../../hooks/useJoyTransfer';
import { getMessage } from '../../utils';
import imgPayTag from '../assets/images/pay-tag.png';
import imgBar from '../assets/images/product-detail-bar.png';
import iconBag from '../assets/svgs/bag.svg';
import iconCreditCard from '../assets/svgs/credit-card.svg';
import iconEllipse from '../assets/svgs/ellipse.svg';
import iconEllipseSelected from '../assets/svgs/ellipse-selected.svg';
import iconBack from '../assets/svgs/icon-goback.svg';
import iconPaypalCard from '../assets/svgs/paypal-card.svg';
import TextInputOutlined from '../components/TextInputOutlined';

const TypeCard = styled.div<{ selected: boolean }>`
  ${tw`flex justify-between p-[14px] md:p-4 h-[60px] md:h-[134px] cursor-pointer transition-all duration-300`}
  background-color: ${(props) =>
    props.selected ? 'rgba(162, 55, 245, 0.1)' : 'transparent'};
  border: ${(props) =>
    props.selected
      ? '2px solid #A237F5'
      : '2px solid rgba(255, 255, 255, 0.3)'};
  position: relative;
  overflow: hidden;
`;

const InfoPanel = styled.div`
  ${tw`relative px-[40px] py-[60px] max-w-[680px] bg-[rgba(255, 255, 255, 0.1)]`}
`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState<string | null>('joy');
  const [pageType, setPageType] = useState<string | null>(null);
  const {
    loggedIn,
    setAuthData,
    setIsLoading,
    setLoggedIn,
    setProductsInCart,
  } = useContext(UserContext);
  const [orders, setOrders] = useState<any[]>([]);
  const [isEnabledOrder, setEnableOrder] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>({});
  const [transferJoy] = useJoyTransfer();
  const { account, activate, active, deactivate } = useWeb3Provider();
  const [joyBalance, tierLv, fetchJoyBalance, tiers] = useJoyBalance();

  const handleChangePayload = (field: string, value: any) => {
    const _payload = { ...payload };
    _payload[field] = value;
    const paymentTypeItem = paymentTypeItems.find(
      (el) => el.key === paymentType
    );
    if (paymentTypeItem) {
      setEnableOrder(
        (loggedIn || _payload.password === _payload.repeat_password) &&
          !paymentTypeItem.billing_fields.some((fld) => {
            return (
              billing_inputs[fld].required &&
              ((billing_inputs[fld].isNew && !loggedIn) ||
                !billing_inputs[fld].isNew) &&
              (_payload[fld] === undefined ||
                _payload[fld] === null ||
                _payload[fld].trim() === '')
            );
          }) &&
          (paymentType !== 'joy' || active) &&
          orders.length > 0
      );
    } else {
      setEnableOrder(false);
    }

    setPayload(_payload);
  };

  const paymentTypeItems = [
    {
      billing_fields: [
        'billing_firstname',
        'billing_lastname',
        'billing_email',
        'billing_phone',
        'password',
        'repeat_password',
        'billing_nick_name',
        'billing_country',
        'billing_street_address',
        'billing_street_address1',
        'billing_city',
        'billing_post_code',
        'billing_discord_username',
        'billing_twitter_username',
      ],
      icon: iconCreditCard,
      key: 'stripe',
      title: 'Pay with Card',
    },
    {
      billing_fields: [
        'billing_email',
        'billing_phone',
        'password',
        'repeat_password',
        'billing_nick_name',
        'billing_discord_username',
        'billing_twitter_username',
      ],
      icon: iconPaypalCard,
      key: 'paypal',
      title: 'PayPal',
    },
    {
      billing_fields: [
        'billing_email',
        'billing_phone',
        'password',
        'repeat_password',
        'billing_nick_name',
        'billing_discord_username',
        'billing_twitter_username',
      ],
      icon: null,
      key: 'joy',
      title: 'Buy with $JOY',
    },
  ];

  const billing_inputs: any = {
    billing_city: { label: 'Town/City', required: true, type: 'text' },
    billing_country: { label: 'Country', required: true, type: 'text' },
    billing_discord_username: {
      label: 'Discord Username',
      required: false,
      type: 'text',
    },
    billing_email: { label: 'Email Address', required: true, type: 'text' },
    billing_firstname: { label: 'First Name', required: true, type: 'text' },
    billing_lastname: { label: 'Last Name', required: true, type: 'text' },
    billing_nick_name: {
      col_span_2: ['paypal', 'joy'],
      label: 'In Game Username',
      required: true,
      type: 'text',
    },
    billing_phone: { label: 'Phone', required: true, type: 'text' },
    billing_post_code: { label: 'Postcode', required: true, type: 'text' },
    billing_street_address: {
      label: 'Street Address',
      required: true,
      type: 'text',
    },
    billing_street_address1: { type: 'text' },
    billing_twitter_username: {
      label: 'Twitter Username',
      required: false,
      type: 'text',
    },
    password: {
      isNew: true,
      label: 'Password',
      required: true,
      type: 'password',
    },
    repeat_password: {
      isNew: true,
      label: 'Repeat Password',
      required: true,
      type: 'password',
    },
  };

  const handleOrder = async () => {
    setIsLoading(true);
    try {
      let user;
      let _orders: any[] = [...orders];
      const orders_LS: any[] = JSON.parse(
        localStorage.getItem('orders') || '[]'
      );
      if (loggedIn) {
        if (orders_LS.length) {
          await Promise.all(
            orders_LS.map(
              async (order) =>
                await requests.post('order/cart', {
                  product: order.product,
                  quantity: order.quantity,
                })
            )
          );
          localStorage.setItem('orders', JSON.stringify([]));
          let res = await requests.get('order/mycart');
          if (!res) throw {};
          _orders = res;
          setOrders(_orders);
          setProductsInCart(_orders);
        }
      } else {
        try {
          try {
            user = await Auth.login({
              password: payload.password,
              username: payload.billing_email,
            });
            window.localStorage.setItem('accessToken', user.access_token);
            window.localStorage.setItem('refreshToken', user.refresh_token);
          } catch (error: any) {
            toast.error(
              getMessage(error.response.data?.message ?? error.toString())
            );
            if (error.response.data?.message === 'Incorrect password') throw {};
          }
          if (!user) {
            user = await Auth.register({
              email: payload.billing_email,
              password: payload.password,
              username: payload.billing_nick_name,
            });
            window.localStorage.setItem('accessToken', user.access_token);
            window.localStorage.setItem('refreshToken', user.refresh_token);
          }
          if (user) {
            if (orders_LS.length) {
              await Promise.all(
                orders_LS.map(
                  async (order) =>
                    await requests.post('order/cart', {
                      product: order.product,
                      quantity: order.quantity,
                    })
                )
              );
              localStorage.setItem('orders', JSON.stringify([]));
            }
            let res = await requests.get('order/mycart');
            if (!res) throw {};
            _orders = res;
            setOrders(_orders);
            setProductsInCart(_orders);
          }
        } catch (error: any) {
          toast.error(
            getMessage(error.response.data?.message ?? error.toString())
          );
        }
      }
      if (paymentType === 'joy') {
        const price = _orders.reduce(
          (carry, order) => carry + order.product.price_joy * order.quantity,
          0
        );
        const hash = await transferJoy(
          parseUnits(price.toString(), JOY_DECIMALS)
        );
        if (hash === undefined) {
          throw new Error('Wallet Transaction failed');
        }
        payload.hash = hash.hash;
      }
      const res = await requests.post('checkout/purchase', {
        billing: payload,
        hash: payload.hash,
        orders: _orders.map((order) => order._id),
        repeat: repeat,
        type: paymentType,
      });
      if (user) {
        setAuthData(user);
        setLoggedIn(true);
      }
      if (res?.redirect_url && res?.redirect_url.length > 0) {
        window.location.href = res.redirect_url;
      }
    } catch (error: any) {
      toast.error(getMessage(error.response.data?.message ?? error.toString()));
    }
    setIsLoading(false);
  };

  const _init = async () => {
    setIsLoading(true);
    try {
      if (!active) {
        activate('Injected');
      }
      if (loggedIn) {
        const res = await requests.get('order/mycart');
        setOrders(res);
        setProductsInCart(res);
      } else {
        const orders_LS: any[] = JSON.parse(
          localStorage.getItem('orders') || '[]'
        );
        if (orders_LS.length) {
          requests
            .post('product/getByIds', {
              ids: orders_LS.map((el) => el.product),
            })
            .then((res: any[]) => {
              if (res) {
                setOrders(
                  res.map((el) => ({
                    product: el,
                    quantity:
                      (orders_LS.find((o) => o.product === el._id) || {})
                        .quantity || 1,
                  }))
                );
              }
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    } catch (error: any) {
      toast.error(error.message ?? error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    _init();
  }, [loggedIn]);

  return (
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-center bg-cover"
    >
      <div tw="h-[88px]" />
      <div tw="py-16 min-h-[calc(100vh - 228px)] border-t border-[#393544]">
        {pageType ? null : (
          <div tw="mx-auto px-2 w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div tw="relative">
              <div tw="absolute left-0 top-[-40px] w-full max-w-[1400px]">
                <button
                  tw="flex items-center gap-2 text-sm"
                  onClick={() => navigate(-1)}
                >
                  <img alt="back" src={iconBack} />
                  Go back
                </button>
              </div>
              <div tw="pb-[44px]">
                <span tw="font-lumadFree text-[24px] leading-[120%]">
                  Checkout
                </span>
              </div>
              <div tw="grid grid-rows-3 md:grid-cols-3 md:grid-rows-1 gap-4 pb-[32px]">
                {paymentTypeItems.map((item, index) => (
                  <TypeCard
                    key={index + '_payment'}
                    selected={item.key === paymentType}
                    onClick={() => setPaymentType(item.key)}
                  >
                    <div tw="flex flex-row md:flex-col justify-between items-start">
                      <img
                        alt="credit"
                        src={
                          item.key === paymentType
                            ? iconEllipseSelected
                            : iconEllipse
                        }
                        tw="cursor-pointer"
                        width={24}
                      />
                      <div tw="ml-[20px] md:ml-0 text-[18px] leading-[120%]">
                        {item.title}
                      </div>
                    </div>
                    {item.icon ? (
                      <img
                        alt="credit"
                        src={item.icon}
                        tw="absolute right-4 top-4"
                        width={24}
                      />
                    ) : null}
                    {item.key === 'joy' && (
                      <div tw="absolute right-0 top-[17px] flex items-center w-[90px] h-5">
                        <img
                          alt=""
                          src={imgPayTag}
                          tw="absolute right-0 top-0 w-full h-full object-contain object-right"
                        />
                        <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-sm text-[#090415]">
                          20% OFF
                        </span>
                      </div>
                    )}
                  </TypeCard>
                ))}
              </div>
              {/* {paymentType !== 'joy' ? (
              <div tw="flex justify-between pb-[35px]">
                <span>Recurring Monthly Payment</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) => setRepeat(e.target.checked)}
                  />
                  <span className="check-slider round" tw="bg-[#1F2E54]" />
                </label>
              </div>
            ) : null} */}
              <div tw="h-[1px] bg-[#404F76] mb-[35px]"></div>
              <div tw="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-[32px]">
                {paymentTypeItems
                  .find((el) => el.key === paymentType)
                  ?.billing_fields?.map((field) => {
                    return billing_inputs[field]?.isNew &&
                      loggedIn ? null : billing_inputs[
                        field
                      ]?.col_span_2?.includes(paymentType) ? (
                      <div tw="col-span-2">
                        <TextInputOutlined
                          id={field + '_payload'}
                          label={billing_inputs[field]?.label || '\u00A0'}
                          required={billing_inputs[field]?.required}
                          type={billing_inputs[field]?.type}
                          value={payload[field]}
                          onChange={(e) =>
                            handleChangePayload(field, e.target.value)
                          }
                        />
                      </div>
                    ) : (
                      <TextInputOutlined
                        id={field + '_payload'}
                        label={billing_inputs[field]?.label || '\u00A0'}
                        required={billing_inputs[field]?.required}
                        type={billing_inputs[field]?.type}
                        value={payload[field]}
                        onChange={(e) =>
                          handleChangePayload(field, e.target.value)
                        }
                      />
                    );
                  })}
              </div>
              <button
                disabled={!isEnabledOrder}
                style={{
                  cursor: isEnabledOrder ? 'pointer' : 'not-allowed',
                  opacity: isEnabledOrder ? 1 : 0.5,
                }}
                tw="relative w-full h-[55px]"
                onClick={handleOrder}
              >
                <div tw="absolute left-0 top-0 w-full h-full z-20 origin-top skew-x-[15deg] overflow-hidden">
                  <div tw="absolute left-0 top-0 w-full h-full bg-[#D2193A] origin-top skew-x-[-28deg]" />
                </div>
                <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase text-white z-30">
                  Order
                </span>
              </button>
            </div>
            <div>
              <div tw="h-[100px]" />
              <InfoPanel>
                <img
                  alt="bar"
                  src={imgBar}
                  tw="absolute left-0 top-0 w-full translate-y-[-50%]"
                />
                <h3 tw="text-[20px] leading-[120%] tracking-[0.1em] text-white uppercase">
                  Your Order
                </h3>
                {orders.length ? (
                  <>
                    <div tw="pt-10 pb-6 flex justify-between border-b border-[rgba(255, 255, 255, 0.3)]">
                      <span tw="w-6/12 text-base leading-[130%] uppercase text-[#A1A8BC]">
                        Item
                      </span>
                      <span tw="w-2/12 text-base leading-[130%] uppercase text-[#A1A8BC] hidden md:block">
                        Quantity
                      </span>
                      <span tw="w-4/12 text-base leading-[130%] uppercase text-[#A1A8BC] text-right">
                        Price
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
                          tw="pl-[78px] w-6/12 h-[80px] text-[16px] leading-[130%] flex items-center bg-no-repeat bg-contain text-white"
                        >
                          {order.product.product_name}
                        </span>
                        <span tw="w-2/12 text-[#A1A8BC] hidden md:block text-base leading-[130%]">
                          {order.quantity} month
                        </span>
                        <span tw="w-4/12 text-[24px] text-white text-right">
                          $ {(order.product.price * order.quantity).toFixed(2)}
                          <br />
                          {paymentType === 'joy' && (
                            <span tw="w-4/12 text-[24px] text-white text-right">
                              ($JOY&nbsp;
                              {(
                                order.product.price_joy * order.quantity
                              ).toFixed(2)}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                    <div tw="pt-[37px] flex justify-between items-center">
                      <span tw="text-[20px] uppercase">Total</span>
                      <span tw="pl-[20px] text-[24px] text-white text-right">
                        $
                        {orders
                          .reduce((carry, order) => {
                            return carry + order.product.price * order.quantity;
                          }, 0)
                          .toFixed(2)}
                        <br />
                        {paymentType === 'joy' && (
                          <span tw="w-4/12 text-[24px] text-white text-right">
                            ($JOY&nbsp;
                            {orders
                              .reduce((carry, order) => {
                                return (
                                  carry +
                                  order.product.price_joy * order.quantity
                                );
                              }, 0)
                              .toFixed(2)}
                            )
                          </span>
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <div tw="flex flex-col items-center">
                    <img alt="" src={iconBag}></img>
                    <div tw="text-[24px] font-semibold mt-[34px]">
                      Oops! Your cart is empty
                    </div>
                    <div tw="mt-[17px] text-[#F6FAFF] opacity-30 max-w-[236px] text-center">
                      Looks like you haven’t added any NFT’s to your cart yet
                    </div>
                    <button
                      tw="px-[99px] h-[68px] mt-[36px] font-bold text-xl bg-[#35924A] rounded-xl mb-[30px]"
                      onClick={() => navigate('/game')}
                    >
                      Shop Now
                    </button>
                  </div>
                )}
              </InfoPanel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;

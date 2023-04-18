import '../../styles/common.css';

import * as _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import requests from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import imgBarDesktop from '../assets/images/cart-bg_desktop.png';
import imgBarMobile from '../assets/images/cart-bg_mobile.png';
import iconDelete from '../assets/svgs/delete.svg';
import iconBack from '../assets/svgs/icon-goback.svg';
import iconJoystick from '../assets/svgs/joystick_blue.svg';

const InfoPanel = styled.div`
  ${tw`relative mx-auto px-4 md:px-[44px] pt-[44px] pb-[190px] md:pt-[71px] md:pb-[71px] bg-[rgba(255, 255, 255, 0.1)]`}
`;

const CartPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const { isFirstLoaded, loggedIn, setIsLoading, setProductsInCart } =
    useContext(UserContext);

  const init = async () => {
    if (!isFirstLoaded) return;
    setIsLoading(true);
    try {
      const orders_LS: any[] = JSON.parse(
        localStorage.getItem('orders') || '[]'
      );
      if (loggedIn) {
        let res: any[] = await requests.get('order/mycart');
        if (!res) throw {};
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
          res = await requests.get('order/mycart');
        }
        if (!res) throw {};
        localStorage.setItem('orders', JSON.stringify([]));
        setOrders(res);
        setProductsInCart(res);
      } else {
        if (orders_LS.length) {
          const res: any[] = await requests.post('product/getByIds', {
            ids: orders_LS.map((el) => el.product),
          });
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
        }
      }
    } catch (error) {}
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [isFirstLoaded]);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const handleClickDelete = async (order: any) => {
    setIsLoading(true);
    try {
      if (loggedIn) {
        await requests.delete('order/' + order._id);
        const res = await requests.get('order/mycart');
        if (res) {
          setOrders(res);
          setProductsInCart(res);
        }
      } else {
        let productIds = JSON.parse(localStorage.getItem('cart') || '[]');
        productIds = _.difference(productIds, [order.product._id]);
        localStorage.setItem('cart', JSON.stringify(productIds));
        if (productIds.length) {
          const res: any[] = await requests.post('product/getByIds', {
            ids: productIds,
          });
          if (res) {
            setOrders(res.map((el) => ({ product: el, quantity: 1 })));
          }
        } else {
          setOrders([]);
        }
      }
    } catch (error) {}
    setIsLoading(false);
  };

  return (
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-top bg-cover"
    >
      <div tw="h-[88px]" />
      <div tw="py-[47px] min-h-[calc(100vh - 228px)] border-t border-[#393544]">
        <div tw="mx-auto md:px-2 w-full max-w-[1220px]">
          <button
            tw="px-2 md:px-0 flex items-center gap-2 text-sm tracking-[0.22em] leading-[130%] uppercase"
            onClick={() => navigate(-1)}
          >
            <img alt="back" src={iconBack} />
            Go back
          </button>
          <h2 tw="px-2 md:px-0 pt-2 md:pt-8 pb-[56px] md:pb-[47px] font-lumadFree text-[16px] md:text-[24px] leading-[120%]">
            Cart
          </h2>
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
            {orders.length ? (
              <>
                <div tw="pb-6 flex justify-between border-b border-[#404F76]">
                  <span tw="w-6/12 text-base uppercase text-[#A1A8BC]">
                    Item
                  </span>
                  <span tw="hidden md:block w-2/12 text-base uppercase text-[#A1A8BC]">
                    Price
                  </span>
                  <span tw="hidden md:block w-2/12 text-base uppercase text-[#A1A8BC]">
                    Quantity
                  </span>
                  <span tw="w-1/12 text-base uppercase text-[#A1A8BC]">
                    Subtotal
                  </span>
                  <span tw="w-1/12"></span>
                </div>
                {orders.map((order) => (
                  <div
                    key={order._id + '_order'}
                    tw="h-[90px] flex justify-between items-center border-b border-[#404F76]"
                  >
                    <span
                      css={{
                        backgroundImage: `url(${order.product.axie.image})`,
                        backgroundPositionX: -20,
                      }}
                      tw="pl-[68px] md:pl-[78px] md:w-6/12 h-[70px] md:h-[80px] flex flex-col justify-center bg-no-repeat bg-contain"
                    >
                      <p>
                        <Link
                          to={`/product/${order.product.game}/${order.product._id}`}
                          tw="text-white hover:text-[#A1A8BC]"
                        >
                          {order.product.product_name}
                        </Link>
                      </p>
                      <p tw="md:hidden text-sm text-[#A1A8BC]">
                        {order.quantity} month
                      </p>
                    </span>
                    <span tw="hidden md:block md:w-2/12 text-[#A1A8BC]">
                      ${order.product.price.toFixed(2)}
                    </span>
                    <span tw="hidden md:block md:w-2/12 text-[#A1A8BC]">
                      {order.quantity} month{order.quantity > 1 ? 's' : ''}
                    </span>
                    <span
                      title={`Discount: ${order.product.potential_discount.toFixed(
                        2
                      )}%`}
                      tw="md:w-1/12 text-[24px]"
                    >
                      ${(order.quantity * order.product.price).toFixed(2)}
                    </span>
                    <span
                      tw="md:w-1/12 flex justify-end"
                      onClick={() => handleClickDelete(order)}
                    >
                      <img
                        alt="delete"
                        src={iconDelete}
                        tw="cursor-pointer"
                        width={32}
                      />
                    </span>
                  </div>
                ))}
                <div tw="pt-[34px] md:pt-0 md:absolute right-0 md:bottom-[-55px] w-full flex flex-col md:flex-row justify-end items-center gap-[34px]">
                  <div tw="w-full md:w-auto flex justify-between items-center">
                    <span tw="text-[24px]">Total:</span>
                    <span tw="pl-4 text-[24px]">
                      $
                      {orders
                        .reduce((carry, order) => {
                          return carry + order.quantity * order.product.price;
                        }, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <button
                    tw="relative px-10 w-full max-w-[433px] h-[55px]"
                    onClick={() => navigate('/checkout')}
                  >
                    <div tw="absolute left-0 top-0 w-full h-full overflow-hidden origin-top skew-x-[-15deg] md:skew-x-0 z-10">
                      <div tw="absolute left-0 top-0 w-full h-full origin-top skew-x-[27deg] md:skew-x-[15deg] bg-[#D2193A]" />
                    </div>
                    <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] uppercase text-white z-30">
                      Proceed to Checkout
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <div tw="pt-[146px] md:pt-0 flex flex-col items-center">
                <img alt="cart" src={iconJoystick} tw="w-[50px]" />
                <div tw="pt-[24px] text-[20px] leading-[130%] uppercase">
                  Oops! Your cart is empty
                </div>
                <div tw="pt-4 pb-8 text-[16px] text-[#A1A8BC] text-center">
                  Looks like you haven't added any NFT's to your cart yet
                </div>
                <button
                  tw="relative w-[179px] h-10 flex items-center uppercase text-white"
                  onClick={() => navigate('/game')}
                >
                  <div tw="absolute left-0 top-0 w-full h-full -skew-x-12 bg-[#D2193A] z-10" />
                  <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center tracking-[0.1em] z-20">
                    Shop Now
                  </span>
                </button>
              </div>
            )}
          </InfoPanel>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

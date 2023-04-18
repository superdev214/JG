import '../styles/common.css';

import * as _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import requests from '../api/api';
import iconBag from '../assets/svgs/bag.svg';
import iconDelete from '../assets/svgs/delete.svg';
import iconBack from '../assets/svgs/icon-goback.svg';
import { UserContext } from '../contexts/UserContext';

const InfoPanel = styled.div`
  ${tw`mx-auto px-4 md:px-[44px] py-[36px] md:rounded-2xl`}

  background: linear-gradient(0deg, #152348, #152348), #0c1938;
  box-shadow: 0px 34px 90px -20px rgba(10, 39, 97, 0.5),
    inset 0px 2px 13px rgba(0, 71, 255, 0.21);
  border: 1px solid;
  border-image-source: linear-gradient(
    90deg,
    rgba(34, 90, 238, 0) 0%,
    #225aee 48.41%,
    rgba(34, 90, 238, 0) 100%
  );
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
    <div tw="py-8 min-h-[calc(100vh - 228px)] bg-[#02091B]">
      <div tw="mx-auto md:px-2 w-full max-w-[1220px]">
        <button
          tw="px-2 md:px-0 flex items-center gap-2 text-sm"
          onClick={() => navigate(-1)}
        >
          <img alt="back" src={iconBack} />
          Go back
        </button>
        <h2 tw="px-2 md:px-0 pt-4 pb-8 font-semibold text-[32px]">Cart</h2>
        <InfoPanel>
          {orders.length ? (
            <>
              <div tw="pb-6 flex justify-between border-b border-[#404F76]">
                <span tw="w-6/12 text-[#A1A8BC]">Item</span>
                <span tw="hidden md:block w-2/12 text-[#A1A8BC]">Price</span>
                <span tw="hidden md:block w-2/12 text-[#A1A8BC]">Quantity</span>
                <span tw="w-1/12 text-[#A1A8BC]">Subtotal</span>
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
                    {order.quantity} month
                  </span>
                  <span
                    title={`Discount: ${order.product.potential_discount.toFixed(
                      2
                    )}%`}
                    tw="md:w-1/12 font-semibold text-xl md:text-2xl"
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
              <div tw="pt-[55px] flex flex-col md:flex-row justify-end items-center gap-6">
                <div tw="w-full md:w-auto flex justify-between items-center">
                  <span tw="font-bold text-xl">Total:</span>
                  <span tw="pl-[20px] font-semibold text-2xl">
                    ${' '}
                    {orders
                      .reduce((carry, order) => {
                        return carry + order.quantity * order.product.price;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <button
                  tw="px-10 w-full md:w-auto h-[68px] font-bold text-xl bg-[#35924A] rounded-xl"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <div tw="flex flex-col items-center">
              <img alt="cart" src={iconBag} />
              <div tw="text-[24px] font-semibold mt-[34px]">
                Oops! Your cart is empty
              </div>
              <div tw="mt-[17px] text-[#F6FAFF] opacity-30 max-w-[236px] text-center">
                Looks like you haven't added any NFT's to your cart yet
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
  );
};

export default CartPage;

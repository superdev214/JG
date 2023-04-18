import '../styles/common.css';
import 'react-popper-tooltip/dist/styles.css';

import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
// import { usePopperTooltip } from 'react-popper-tooltip';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import { MarketplaceApi, OrderApi } from '../api/api';
import iconBack from '../assets/svgs/icon-goback.svg';
import TooltipSpan from '../components/TooltipSpan';
import { UserContext } from '../contexts/UserContext';
import { IProduct } from '../type';
import { getMessage } from '../utils/common';
import { classToColorNumber } from '../utils/games';

const ProductImage = styled.div`
  ${tw`absolute left-0 top-0 w-full h-full bg-contain bg-no-repeat`}

  background-position-x: 50%;
  animation: bounce-background 2s infinite ease-in-out;
  -webkit-animation: bounce-background 2s infinite ease-in-out;

  @keyframes bounce-background {
    from {
      background-position-y: 40%;
    }
    50% {
      background-position-y: 60%;
    }
    to {
      background-position-y: 40%;
    }
  }
`;

const InfoPanel = styled.div`
  ${tw`px-[44px] py-[36px] max-w-[680px]`}

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

const ProductPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { loggedIn, productsInCart, setIsLoading } = useContext(UserContext);
  // const {
  //   getArrowProps,
  //   getTooltipProps,
  //   setTooltipRef,
  //   setTriggerRef,
  //   visible,
  // } = usePopperTooltip();
  const [data, setData] = useState<IProduct | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  const handleClickRent = async () => {
    if (!data) return;
    if (loggedIn) {
      setIsLoading(true);
      OrderApi.addCart({ product: data._id, quantity: 1 })
        .then((res) => {
          if (res) {
            navigate('/cart');
          }
        })
        .catch((err) => {
          toast.error(
            getMessage(
              `${err.response.data?.error ?? err.toString()}: ${
                err.response.data?.message ?? ''
              }`
            )
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      let orders: any[] = JSON.parse(localStorage.getItem('orders') || '[]');
      const order = orders.find((el) => el.product === data._id);
      if (order) {
        order.quantity = parseInt(order.quantity || '1');
        order.quantity++;
      } else {
        orders.push({ product: data._id, quantity: 1 });
      }

      localStorage.setItem('orders', JSON.stringify(orders));
      navigate('/cart');
    }
  };

  useEffect(() => {
    if (params.id) {
      setIsLoading(true);
      MarketplaceApi.getProductById(params.id)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          toast.error(
            getMessage(
              `${err.response.data?.error ?? err.toString()}: ${
                err.response.data?.message ?? ''
              }`
            )
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params, setIsLoading]);

  useEffect(() => {
    if (params.id && productsInCart && productsInCart.length > 0) {
      for (const prd of productsInCart) {
        if (prd.product && prd.product._id === params.id) {
          setAddedToCart(true);
          break;
        }
      }
    }
  }, [params, productsInCart]);

  return (
    <div tw="py-16 min-h-[calc(100vh - 228px)] bg-[#02091B]">
      {data ? (
        <div tw="mx-auto px-2 w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2">
          <div tw="relative pt-[90%]">
            <div tw="absolute left-0 top-[-40px] w-full max-w-[1400px]">
              <button
                tw="flex items-center gap-2 text-sm"
                onClick={() => navigate(-1)}
              >
                <img alt="back" src={iconBack} />
                Go back
              </button>
            </div>
            <ProductImage css={{ backgroundImage: `url(${data.axie.image})` }}>
              <span tw="absolute px-2 h-[22px] flex items-center font-semibold text-[32px] rounded-xl">
                {data.product_name}
              </span>
            </ProductImage>
          </div>
          <InfoPanel>
            <div tw="pb-8 flex justify-center gap-5 flex-wrap border-b border-[#404F76]">
              <div tw="flex gap-3">
                <span tw="text-[#A1A8BC]">Class:</span>
                <span
                  css={{
                    backgroundImage: `url(/images/classes/${data.axie.class.toLowerCase()}.png)`,
                  }}
                  tw="capitalize pr-7 bg-contain bg-no-repeat bg-right"
                >
                  {data.axie.class}
                </span>
              </div>
              <div tw="flex gap-3">
                <span tw="text-[#A1A8BC]">Breed count:</span>
                <span tw="capitalize">{data.axie.breedCount}/7</span>
              </div>
            </div>
            <div tw="py-8 border-b border-[#404F76]">
              <div tw="text-center text-[#A1A8BC]">Body parts</div>
              <div tw="pt-4 flex flex-wrap justify-center gap-16">
                <div>
                  {data.axie.parts.map((part, index) =>
                    index % 2 === 0 ? (
                      <div
                        key={part.id}
                        css={{
                          backgroundImage: `url(/images/parts/${part.type.toLowerCase()}/${classToColorNumber(
                            part.class.toLowerCase()
                          )}.svg)`,
                          backgroundPositionY: 'center',
                          backgroundSize: 48,
                        }}
                        tw="pl-[58px] py-2 w-1/2 bg-no-repeat"
                      >
                        <div tw="whitespace-nowrap">{part.name}</div>
                        <div tw="pt-1 text-xs whitespace-nowrap text-[#A1A8BC]">
                          Level {part.stage}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
                <div>
                  {data.axie.parts.map((part, index) =>
                    index % 2 ? (
                      <div
                        key={part.id}
                        css={{
                          backgroundImage: `url(/images/parts/${part.type.toLowerCase()}/${classToColorNumber(
                            part.class.toLowerCase()
                          )}.svg)`,
                          backgroundPositionY: 'center',
                          backgroundSize: 48,
                        }}
                        tw="pl-[58px] py-2 w-1/2 bg-no-repeat"
                      >
                        <div tw="whitespace-nowrap">{part.name}</div>
                        <div tw="pt-1 text-xs whitespace-nowrap text-[#A1A8BC]">
                          Level {part.stage}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            </div>
            <div tw="pt-8 flex justify-center items-center flex-wrap gap-8">
              <div tw="text-center">
                <p tw="font-semibold text-base">Potential Earnings</p>
                <p tw="flex justify-center items-center gap-2">
                  <span tw="font-semibold text-2xl">
                    {data.potential_earnings.toFixed(2)}
                  </span>
                  <TooltipSpan
                    content={
                      <>
                        These are estimated in-game earning that this NFT can
                        yield per month
                      </>
                    }
                    label="?"
                  />
                </p>
                <p tw="font-semibold text-base text-[#A1A8BC]">$SLP/monthly</p>
              </div>
              <div tw="text-center">
                <p tw="font-semibold text-base">Discount</p>
                <p tw="flex justify-center items-center gap-2">
                  <span tw="font-semibold text-2xl">
                    {data.potential_discount.toFixed(1)}%
                  </span>
                  <TooltipSpan
                    content={
                      <>
                        $JOY token holders can receive up to a 20% discount on
                        any Joystick NFT's. If you would like to purchase $JOY
                        tokens, please <a href="#">Click Here</a>
                      </>
                    }
                    label="?"
                  />
                </p>
                <p tw="font-semibold text-base text-[#A1A8BC]">
                  for $JOY Holders
                </p>
              </div>
            </div>
            <div tw="pt-9">
              {addedToCart ? (
                <p
                  tw="w-full h-[56px] flex justify-center items-center text-xl bg-[#8b8b8b66] rounded-2xl"
                  // onClick={() => navigate('/cart')}
                >
                  Already in Cart
                </p>
              ) : (
                <button
                  tw="w-full h-[56px] text-xl bg-[#35924A] hover:bg-[#246432] rounded-2xl"
                  // tw="w-full h-[56px] text-xl bg-[#8b8b8b66] hover:bg-[#8b8b8b66] rounded-2xl cursor-default"
                  onClick={handleClickRent}
                >
                  Rent for 1 month:{' '}
                  <strong tw="text-xl">${data.price.toFixed(2)}</strong>
                </button>
              )}
            </div>
          </InfoPanel>
        </div>
      ) : null}
    </div>
  );
};

export default ProductPage;

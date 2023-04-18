import '../../styles/common.css';
import 'react-popper-tooltip/dist/styles.css';

import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import tw, { styled } from 'twin.macro';

import { MarketplaceApi, OrderApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { IProduct } from '../../type';
import { getMessage } from '../../utils/common';
import { classToColorNumber } from '../../utils/games';
import imgBar from '../assets/images/product-detail-bar.png';
import iconBack from '../assets/svgs/icon-goback.svg';
import TooltipSpan from '../components/TooltipSpan';

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
  ${tw`relative px-0 pt-[60px] max-w-[680px] bg-[rgba(255, 255, 255, 0.1)]`}
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
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-top bg-cover"
    >
      <div tw="h-[88px]" />
      <div tw="py-[97px] min-h-[calc(100vh - 228px)] border-t border-[#393544]">
        {data ? (
          <div tw="mx-auto px-0 md:px-2 w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2">
            <div tw="relative pt-[90%]">
              <div tw="absolute left-0 top-[-30px] md:top-[-40px] w-full max-w-[1400px]">
                <button
                  tw="flex items-center px-4 md:px-2 gap-2 text-sm tracking-[0.22em] leading-[130%] uppercase"
                  onClick={() => navigate(-1)}
                >
                  <img alt="back" src={iconBack} />
                  Go back
                </button>
              </div>
              <ProductImage
                css={{ backgroundImage: `url(${data.axie.image})` }}
              >
                <span tw="absolute px-4 md:px-2 h-[22px] flex items-center font-lumadFree text-[16px] md:text-[24px] leading-[120%]">
                  {data.product_name}
                </span>
              </ProductImage>
            </div>
            <InfoPanel>
              <img
                alt="bar"
                src={imgBar}
                tw="absolute left-0 top-0 w-full translate-y-[-50%]"
              />
              <div tw="px-4 md:px-[53px] pb-10 grid grid-cols-2 gap-x-2 md:gap-x-10 gap-y-10 border-b border-[#393544]">
                <div tw="flex gap-2">
                  <span tw="text-[16px] md:text-[18px] leading-[120%] uppercase text-[#A1A8BC]">
                    Class:
                  </span>
                  <span
                    css={{
                      backgroundImage: `url(/images/classes/${data.axie.class.toLowerCase()}.png)`,
                    }}
                    tw="text-[16px] md:text-[18px] leading-[120%] uppercase pr-7 bg-contain bg-no-repeat bg-right"
                  >
                    {data.axie.class}
                  </span>
                </div>
                <div tw="flex gap-2">
                  <span tw="text-[16px] md:text-[18px] leading-[120%] uppercase text-[#A1A8BC]">
                    Breed count:
                  </span>
                  <span tw="text-[16px] md:text-[18px] leading-[120%] uppercase">
                    {data.axie.breedCount}/7
                  </span>
                </div>
              </div>
              <div tw="px-4 md:px-[53px] py-10 grid grid-cols-2 gap-x-2 md:gap-x-10 gap-y-[29px] border-b border-[#393544]">
                {data.axie.parts.map((part) => (
                  <div
                    key={part.id}
                    css={{
                      backgroundImage: `url(/images/parts/${part.type.toLowerCase()}/${classToColorNumber(
                        part.class.toLowerCase()
                      )}.svg)`,
                      backgroundPositionY: 'center',
                      backgroundSize: 48,
                    }}
                    tw="pl-[50px] md:pl-[55px] w-1/2 bg-no-repeat"
                  >
                    <div tw="text-base md:text-[18px] md:tracking-[0.1em] leading-[120%] uppercase whitespace-nowrap text-white">
                      {part.name}
                    </div>
                    <div tw="pt-1 text-sm md:text-[16px] tracking-[0.1em] leading-[120%] uppercase whitespace-nowrap text-[#A1A8BC]">
                      Level {part.stage}
                    </div>
                  </div>
                ))}
              </div>
              <div tw="px-4 md:px-[53px] pt-8 pb-7 md:pb-[61px] grid grid-cols-2 gap-x-2 md:gap-x-10 gap-y-8">
                <div tw="">
                  <p tw="flex items-center gap-[7px]">
                    <span tw="text-sm md:text-[18px] md:tracking-[0.1em] leading-[120%] uppercase">
                      Potential Earnings
                    </span>
                    <TooltipSpan
                      content={
                        <p tw="text-sm uppercase text-black">
                          These are estimated in-game earning that this NFT can
                          yield per month
                        </p>
                      }
                      label="?"
                    />
                  </p>
                  <p tw="pt-1 text-[24px] md:text-[32px] leading-[120%]">
                    {data.potential_earnings.toFixed(2)}
                  </p>
                  <p tw="pt-1 text-xs md:text-base tracking-[0.1em] leading-[120%] uppercase text-[#A1A8BC]">
                    $SLP /monthly
                  </p>
                </div>
                <div tw="">
                  <p tw="flex items-center gap-[7px]">
                    <span tw="text-sm md:text-[18px] md:tracking-[0.1em] leading-[120%] uppercase">
                      Discount
                    </span>
                    <TooltipSpan
                      content={
                        <p tw="text-sm uppercase text-black">
                          $JOY token holders can receive up to a 20% discount on
                          any Joystick NFT's. If you would like to purchase $JOY
                          tokens, please{' '}
                          <a href="#" tw="text-sm uppercase text-[#A237F5]">
                            Click Here
                          </a>
                        </p>
                      }
                      label="?"
                    />
                  </p>
                  <p tw="pt-1 text-[24px] md:text-[32px] leading-[120%] uppercase">
                    Up to {data.potential_discount.toFixed(1)}%
                  </p>
                  <p tw="pt-1 text-xs md:text-base tracking-[0.1em] leading-[120%] uppercase text-[#A1A8BC]">
                    for $JOY Holders
                  </p>
                </div>
              </div>
              <div tw="md:absolute mx-auto pb-8 md:pb-0 left-0 w-[calc(100% - 32px)] md:w-full top-[100%]">
                {addedToCart ? (
                  <p
                    tw="relative w-full h-[55px]"
                    // onClick={() => navigate('/cart')}
                  >
                    <div tw="absolute left-0 top-0 w-full h-full skew-x-[15deg] origin-top overflow-hidden">
                      <div tw="absolute left-0 top-0 w-full h-full skew-x-[-28deg] origin-top bg-[#8b8b8b66]" />
                    </div>
                    <div tw="absolute left-0 top-0 w-full h-full flex justify-center items-center gap-3 text-[16px] tracking-[0.22em] uppercase">
                      Already in Cart
                    </div>
                  </p>
                ) : (
                  <button
                    tw="relative w-full h-[87px] md:h-[55px] hover:opacity-70"
                    onClick={handleClickRent}
                  >
                    <div tw="absolute left-0 top-0 w-full h-full skew-x-[15deg] origin-top overflow-hidden">
                      <div tw="absolute left-0 top-0 w-full h-full skew-x-[-28deg] origin-top bg-[#D2193A]" />
                    </div>
                    <div tw="absolute left-0 top-0 w-full h-full flex flex-col md:flex-row justify-center items-center gap-0 md:gap-3">
                      <span tw="text-[16px] tracking-[0.22em] uppercase">
                        Rent for one month:
                      </span>
                      <span tw="text-[28px]">${data.price.toFixed(2)}</span>
                    </div>
                  </button>
                )}
              </div>
            </InfoPanel>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductPage;

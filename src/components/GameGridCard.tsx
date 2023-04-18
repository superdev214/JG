import 'twin.macro';

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GameItem } from '../utils/games';

interface CardExtProps {
  fullWidth?: boolean;
  prefix: string;
}

interface CardProps extends GameItem, CardExtProps {}

const GameGridCard = (props: CardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="group"
      css={{
        background: 'linear-gradient(to right, #0C1938, #225AEE, #0C1938)',
        boxShadow: '0 0 60px 0 #fff1',
        cursor: props.prefix === 'Axie Infinity' ? 'pointer' : 'default',
      }}
      tw="relative px-4 py-5 w-[158px] md:w-[278px] h-[192px] md:h-[338px] overflow-hidden rounded-2xl"
      onClick={() =>
        props.prefix === 'Axie Infinity'
          ? navigate(`/product/${props.prefix}/${props._id}`)
          : {}
      }
    >
      <div
        css={{ transition: 'all 0.3s ease-out' }}
        tw="absolute left-0 hover:left-[3px] top-0 hover:top-[3px] w-full hover:w-[calc(100% - 6px)] h-full hover:h-[calc(100% - 6px)] bg-[#0C1938] rounded-2xl z-10"
      />
      <div
        css={{
          backgroundImage: `url(${props.axie?.image ?? props.detail?.image})`,
          ...(props.prefix === 'Axie Infinity'
            ? {
                backgroundSize: 'contain',
                height: '100%',
                left: 0,
                paddingTop: 'unset',
                top: 0,
                transform: 'none',
                width: '100%',
              }
            : {
                backgroundSize: 'cover',
                height: 'unset',
                left: '50%',
                paddingTop: '60%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60%',
              }),
        }}
        tw="absolute bg-center bg-no-repeat pointer-events-none rounded-full z-20"
      />
      <span tw="absolute px-2.5 left-2 md:left-4 h-[18px] md:h-[28px] inline-flex items-center font-semibold text-xs md:text-base bg-[#1481D0] rounded-2xl pointer-events-none z-20">
        {props.product_name}
      </span>
      <div tw="absolute left-2 md:left-4 bottom-2 md:bottom-3 pointer-events-none z-40">
        <div
          style={
            props.prefix === 'Axie Infinity'
              ? { textDecorationLine: 'line-through' }
              : {}
          }
          tw="font-medium text-xs md:text-sm text-[#888]"
        >
          {props.prefix === 'Axie Infinity'
            ? `$${props.price.toFixed(0)}`
            : 'Price'}
        </div>
        <span tw="font-medium md:font-semibold text-base md:text-2xl">
          {props.prefix === 'Axie Infinity'
            ? `$${(props.price - props.potential_discount).toFixed(0)}/MO`
            : 'TBD'}
        </span>
      </div>
      <div tw="absolute right-2 md:right-4 bottom-2 md:bottom-3 font-medium text-right pointer-events-none z-20">
        <div tw="font-medium text-xs md:text-sm text-[#888]">
          Potential Earnings
        </div>
        <span tw="font-medium md:font-semibold text-base md:text-2xl">
          {props.prefix === 'Axie Infinity'
            ? `$${(props.potential_earnings * 1).toFixed(0)}/MO`
            : 'TBD'}
        </span>
      </div>
      {/* location.pathname === '/' ? null : (
        <button
          tw="absolute px-6 hidden group-hover:flex left-0 bottom-0 w-full h-[72px] justify-end items-center bg-[#35924A] hover:bg-[#246432] z-30"
          onClick={(e) => {
            e.stopPropagation();
            setIsLoading(true);
            OrderApi.addCart({ product: props._id, quantity: 1 })
              .then((res) => {
                if (res) {
                  navigate('/cart');
                }
              })
              .catch((err) => {
                toast.error(err.message);
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          <img alt="cart" src={iconCart} width="36px" />
        </button>
        ) */}
    </div>
  );
};

export default GameGridCard;

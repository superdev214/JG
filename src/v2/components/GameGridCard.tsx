import 'twin.macro';

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GameItem } from '../../utils/games';
import iconLink from '../assets/svgs/external-link.svg';
import iconCart from '../assets/svgs/icon-cart.svg';

interface CardExtProps {
  fullWidth?: boolean;
  prefix: string;
}

interface CardProps extends GameItem, CardExtProps {}

const GameGridCard = (props: CardProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="group"
      css={{
        cursor: props.prefix === 'Axie Infinity' ? 'pointer' : 'default',
      }}
      tw="relative px-4 py-5 w-[174px] md:w-[278px] h-[240px] md:h-[338px] border border-[rgba(255, 255, 255, 0.2)] hover:border-[#A237F5] bg-[#070215] overflow-hidden hover:shadow-[6px 8px 0px #7327B2, 0px 0px 29px rgba(162, 55, 245, 0.4)] transition-all duration-300"
      onClick={() =>
        props.prefix === 'Axie Infinity'
          ? navigate(`/product/${props.prefix}/${props._id}`)
          : {}
      }
    >
      {/* <div
        css={{ transition: 'all 0.3s ease-out' }}
        tw="absolute left-0 hover:left-[3px] top-0 hover:top-[3px] w-full hover:w-[calc(100% - 6px)] h-full hover:h-[calc(100% - 6px)] bg-[#070215] z-10"
      /> */}
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
                paddingTop: '80%',
                top: '40%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
              }),
        }}
        tw="absolute bg-center bg-no-repeat pointer-events-none z-20"
      />
      <span tw="absolute px-4 left-0 top-0 h-7 md:h-10 inline-flex items-center font-semibold text-xs md:text-base bg-[#2C263A] group-hover:bg-[#A237F5] pointer-events-none transition-all duration-300 z-20">
        {props.product_name}
      </span>
      <img
        alt="link"
        src={iconLink}
        tw="absolute right-[7px] md:right-4 top-[7px] md:top-[13px] z-20"
        width={14}
      />
      <div tw="absolute left-2 md:left-4 bottom-2.5 md:bottom-[17px] pointer-events-none z-40">
        <div
          style={
            props.prefix === 'Axie Infinity'
              ? { textDecorationLine: 'line-through' }
              : {}
          }
          tw="font-medium text-[17px] md:text-[24px] leading-[100%] text-[#888]"
        >
          {props.prefix === 'Axie Infinity'
            ? `$${props.price.toFixed(0)}`
            : 'Price'}
        </div>
        <div tw="pt-0.5 font-normal text-[23px] md:text-[32px] leading-[100%]">
          {props.prefix === 'Axie Infinity' ? (
            <>
              ${(props.price - props.potential_discount).toFixed(0)}
              <span tw="text-[17px] md:text-[24px]">/MO</span>
            </>
          ) : (
            'TBD'
          )}
        </div>
      </div>
      <div tw="absolute right-2 md:right-4 bottom-2.5 md:bottom-4 font-medium text-right pointer-events-none z-20">
        <div tw="font-medium text-[11px] md:text-[14px] leading-[100%] text-[#888]">
          Potential
          <br />
          Earnings
        </div>
        <span tw="font-normal text-[23px] md:text-[32px] leading-[100%]">
          {props.prefix === 'Axie Infinity' ? (
            <>
              ${(props.potential_earnings * 1).toFixed(0)}
              <span tw="text-[17px] md:text-[24px]">/MO</span>
            </>
          ) : (
            'TBD'
          )}
        </span>
      </div>
      {location.pathname === '/' ? null : (
        <button tw="absolute px-6 hidden group-hover:flex right-0 bottom-2.5 md:bottom-4 w-[86px] md:w-[110px] h-[48px] md:h-[61px] justify-end items-center bg-[#A237F5] skew-x-[-20deg] origin-bottom z-30">
          <div tw="absolute left-0 top-0 w-full h-full flex justify-center items-center skew-x-[20deg]">
            <img alt="cart" src={iconCart} width="38px" />
          </div>
        </button>
      )}
    </div>
  );
};

export default GameGridCard;

import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { MarketplaceApi } from '../../api/api';
import { UserContext } from '../../contexts/UserContext';
import { IGame, IProduct } from '../../type';
import iconNext from '../assets/svgs/icon-next.svg';
import GameGridCard from './GameGridCard';

const GameGridSection = () => {
  const { setIsLoading } = useContext(UserContext);

  const [gameList, setGameList] = useState<IGame[]>([]);
  const [productList, setProductList] = useState<any>({
    'Axie Infinity': [],
    'Big Time': [],
    Otherside: [],
  });

  useEffect(() => {
    setIsLoading(true);
    MarketplaceApi.listGames()
      .then((res) => {
        const sortedList = res.sort((a, b) =>
          a._id > b._id ? 1 : a._id < b._id ? -1 : 0
        );
        setGameList(sortedList);

        for (const item of sortedList) {
          MarketplaceApi.listProducts(item.name, 0, 4)
            .then((res) => {
              if (res.items.length > 0) {
                setProductList((oldList: any) => ({
                  ...oldList,
                  [item.name]: res.items,
                }));
              }
            })
            .catch((err) => {
              toast.error(err.message);
            });
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      css={{ backgroundImage: 'url(/images/main-bg.jpg)' }}
      tw="bg-no-repeat bg-center bg-cover"
    >
      <div id="team" tw="px-2 pt-10 pb-0 md:pb-20 mx-auto max-w-[75rem]">
        {gameList.map((game) =>
          true /* productList[game.name] && productList[game.name].length > 0 */ ? (
            <React.Fragment key={game._id}>
              <div tw="pt-10 relative flex justify-center md:justify-between items-center">
                <div tw="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                  <div
                    css={{
                      backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/file/${game.image})`,
                    }}
                    tw="w-[64px] min-w-[64px] h-[64px] md:w-[84px] md:min-w-[84px] md:h-[84px] bg-no-repeat bg-center bg-contain bg-[#1B1332] border-4 md:border-[6px] border-[#1B1332] rounded-[5px]"
                  />
                  <h2 tw="pt-3 md:pt-0 md:pb-3.5 font-lumadFree text-[18px] md:text-[24px] font-normal leading-[120%]">
                    {game.name}
                  </h2>
                </div>
                <Link
                  key={game._id}
                  to={`/game/${game.name}`}
                  tw="hidden md:block"
                >
                  <div tw="pb-1 text-[16px] tracking-[0.22em] leading-[23px] uppercase whitespace-nowrap text-white">
                    See All &gt;&gt;
                  </div>
                  <div tw="w-full h-[3px] skew-x-[-45deg] bg-[#D2193A]" />
                </Link>
              </div>
              <div tw="py-10 flex flex-wrap justify-center md:justify-center content-start gap-2.5 md:gap-6">
                {productList[game.name] && productList[game.name].length > 0
                  ? productList[game.name].map((item: IProduct) => (
                      <GameGridCard
                        key={item._id}
                        {...item}
                        prefix={game.name}
                      />
                    ))
                  : null}
              </div>
              <div tw="text-center">
                <Link
                  key={game._id}
                  to={`/game/${game.name}`}
                  tw="mx-auto pt-4 pb-[100px] inline-block md:hidden"
                >
                  <div tw="pb-1 text-[16px] tracking-[0.22em] leading-[23px] uppercase whitespace-nowrap text-white">
                    See All &gt;&gt;
                  </div>
                  <div tw="w-full h-[3px] skew-x-[-45deg] bg-[#D2193A]" />
                </Link>
              </div>
            </React.Fragment>
          ) : null
        )}
      </div>
    </div>
  );
};

export default GameGridSection;

import 'twin.macro';

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { MarketplaceApi } from '../api/api';
import iconNext from '../assets/svgs/icon-next.svg';
import { UserContext } from '../contexts/UserContext';
import { IGame, IProduct } from '../type';
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
    <div id="team" tw="px-2 pt-10 mx-auto max-w-[75rem]">
      {gameList.map((game) =>
        true /* productList[game.name] && productList[game.name].length > 0 */ ? (
          <React.Fragment key={game._id}>
            <div tw="relative flex justify-between items-center">
              <div tw="flex items-center gap-3 md:gap-6">
                <div
                  css={{
                    backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/file/${game.image})`,
                  }}
                  tw="w-[52px] min-w-[52px] h-[52px] md:w-[79px] md:min-w-[79px] md:h-[79px] bg-no-repeat bg-center bg-contain bg-white border-4 md:border-[6px] border-white rounded-full"
                />
                <h2 tw="text-xl md:text-3xl font-semibold">{game.name}</h2>
              </div>
              <Link
                key={game._id}
                to={`/game/${game.name}`}
                tw="flex items-center gap-2 md:gap-5 text-sm md:text-base whitespace-nowrap"
              >
                See All
                <img alt="next" src={iconNext} width={10} />
              </Link>
            </div>
            <div tw="py-10 flex flex-wrap justify-center md:justify-between content-start gap-x-6 gap-y-6">
              {productList[game.name] && productList[game.name].length > 0
                ? productList[game.name].map((item: IProduct) => (
                    <GameGridCard key={item._id} {...item} prefix={game.name} />
                  ))
                : null}
            </div>
          </React.Fragment>
        ) : null
      )}
    </div>
  );
};

export default GameGridSection;

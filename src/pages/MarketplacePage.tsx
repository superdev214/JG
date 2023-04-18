import '../styles/splitter.css';
import '../styles/common.css';
import 'twin.macro';

import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
// import SplitterLayout from 'react-splitter-layout';
import { toast } from 'react-toastify';

import { MarketplaceApi } from '../api/api';
import iconGoBack from '../assets/svgs/icon-goback.svg';
import iconNext from '../assets/svgs/icon-next.svg';
import iconPrev from '../assets/svgs/icon-prev.svg';
import GameGridCard from '../components/GameGridCard';
import MultiRangeSlider from '../components/MultiRangeSlider';
import { UserContext } from '../contexts/UserContext';
import tags from '../data/game-tags.json';
import { IGame, IProduct } from '../type';

const MarketplacePage = () => {
  const params = useParams();

  const { setIsLoading } = useContext(UserContext);

  const [prefix, setPrefix] = useState<string>('');
  const [games, setGames] = useState<IProduct[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minPrice1, setMinPrice1] = useState<number>(0);
  const [maxPrice1, setMaxPrice1] = useState<number>(1000);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumber1, setPageNumber1] = useState<string>('1');
  const [itemCount, setItemCount] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);

  const [gameList, setGameList] = useState<IGame[]>([]);

  useEffect(() => {
    setIsLoading(true);
    MarketplaceApi.listGames()
      .then((res) => {
        setGameList(res);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const gameName = params.name || 'Axie Infinity';
    setIsLoading(true);
    setPrefix(gameName);
    MarketplaceApi.listProducts(gameName)
      .then((res) => {
        setPageNumber(res.page + 1);
        setItemCount(res.itemCount);
        setPageCount(res.pageCount);
        setGames(res.items);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params, setIsLoading]);

  useEffect(() => {
    if (!prefix || prefix.length === 0) {
      return;
    }

    setIsLoading(true);
    MarketplaceApi.listProducts(
      prefix,
      pageNumber - 1,
      16,
      '',
      categories,
      classes,
      [minPrice, maxPrice]
    )
      .then((res) => {
        setPageNumber(res.page + 1);
        setItemCount(res.itemCount);
        setPageCount(res.pageCount);
        setGames(res.items);
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    setIsLoading,
    categories,
    classes,
    minPrice,
    maxPrice,
    prefix,
    pageNumber,
  ]);

  const getUnit = (gameName: string) => {
    if (gameList) {
      const g = gameList.find((item) => item.name === gameName);
      if (g) {
        return g.productUnit;
      }
    }
    return null;
  };

  return (
    <div
      css={{ gridTemplateColumns: '320px 1fr' }}
      tw="min-h-[calc(100vh - 228px)] relative flex flex-col md:grid border-t border-b border-[#393544] bg-[#02091B]"
    >
      {/* <SplitterLayout
        primaryIndex={1}
        secondaryInitialSize={320}
        secondaryMinSize={220}
      > */}
      <div tw="min-h-[100%] border-r border-[#393544] bg-[#0C1938]">
        <div tw="px-6 pt-12 pb-10">
          <Link to="/" tw="flex items-center">
            <img alt="go back" src={iconGoBack} width="6" />
            <span tw="pl-3 text-sm">Go back</span>
          </Link>
          <h2 tw="pt-4 font-semibold text-2xl">Filter</h2>
        </div>
        <div tw="px-6 py-8 border-t border-b border-[#393544]">
          <h3 tw="text-[#A1A8BC]">Price</h3>
          <MultiRangeSlider
            highValue={maxPrice1}
            lowValue={minPrice1}
            max={1000}
            min={0}
            onChange={({ max, min }: { min: number; max: number }) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
          <div tw="mt-4 relative grid grid-cols-2 gap-x-[26px]">
            <div tw="relative h-[52px] flex items-center border border-[#4c556c] rounded-lg">
              <input
                max={1000}
                min={0}
                tw="appearance-none pl-4 pr-7 w-full outline-none bg-transparent"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice1(parseFloat(e.target.value))}
              />
              <span tw="absolute right-4 top-[50%] translate-y-[-50%] text-[#6e7588]">
                $
              </span>
            </div>
            <div tw="relative h-[52px] flex items-center border border-[#4c556c] rounded-lg">
              <input
                max={1000}
                min={0}
                tw="appearance-none pl-4 pr-7 w-full outline-none bg-transparent"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice1(parseFloat(e.target.value))}
              />
              <span tw="absolute right-4 top-[50%] translate-y-[-50%] text-[#6e7588]">
                $
              </span>
            </div>
            <span tw="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
              -
            </span>
          </div>
        </div>
        {/* <div tw="px-6 pt-8">
            <h3 tw="text-[#A1A8BC]">Game</h3>
            <div tw="pt-1">
              {categories.map((cat) => (
                <label
                  key={cat.key}
                  className="container"
                  tw="mt-3 flex items-center text-base"
                >
                  {cat.title}
                  <input
                    defaultChecked={params.key === cat.key}
                    type="checkbox"
                    onChange={() => {}}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div> */}
        {prefix === 'Axie Infinity' ? (
          <>
            <div tw="px-6 pt-8">
              <h3 tw="text-[#A1A8BC]">Category</h3>
              <div tw="pt-1">
                {tags.types.map((item) => (
                  <label
                    key={item}
                    className="container"
                    tw="mt-3 flex items-center text-base capitalize"
                  >
                    {item}
                    <input
                      id={item}
                      type="checkbox"
                      onChange={(e) => {
                        let _categories;
                        if (e.target.checked) {
                          _categories = [...categories, item];
                        } else {
                          _categories = categories.filter((i) => i !== item);
                        }
                        setCategories(_categories);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
            <div tw="px-6 py-8">
              <h3 tw="text-[#A1A8BC]">Class</h3>
              <div tw="pt-1">
                {tags.classes.map((cls) => (
                  <label
                    key={cls}
                    className="container"
                    css={{
                      backgroundImage: `url(/images/classes/${cls.toLowerCase()}.png)`,
                      backgroundPosition: '32px center',
                      backgroundSize: 24,
                    }}
                    tw="mt-3 pl-[62px] flex items-center text-base capitalize bg-no-repeat"
                  >
                    {cls}
                    <input
                      id={cls}
                      type="checkbox"
                      onChange={(e) => {
                        let _classes;
                        if (e.target.checked) {
                          _classes = [...classes, cls];
                        } else {
                          _classes = classes.filter((i) => i !== cls);
                        }
                        setClasses(_classes);
                      }}
                    />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {prefix === 'Big Time' ? (
          <>
            <div tw="px-6 pt-8">
              <h3 tw="text-[#A1A8BC]">Category</h3>
              <div tw="pt-1">
                {tags.bigTimeCategories.map((item) => (
                  <label
                    key={item}
                    className="container"
                    tw="mt-3 flex items-center text-base capitalize"
                  >
                    {item}
                    <input id={item} type="checkbox" />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
            <div tw="px-6 py-8">
              <h3 tw="text-[#A1A8BC]">Rarity</h3>
              <div tw="pt-1">
                {tags.bigTimeRarity.map((item) => (
                  <label
                    key={item.title}
                    className="container"
                    style={{ color: item.color }}
                    tw="mt-3 flex items-center text-base capitalize"
                  >
                    {item.title}
                    <input id={item.title} type="checkbox" />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {prefix === 'Otherside' ? (
          <>
            <div tw="px-6 pt-8">
              <h3 tw="text-[#A1A8BC]">Category</h3>
              <div tw="pt-1">
                {tags.otherdeedCategory.map((item) => (
                  <label
                    key={item}
                    className="container"
                    tw="mt-3 flex items-center text-base capitalize"
                  >
                    {item}
                    <input id={item} type="checkbox" />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
            <div tw="px-6 py-8">
              <h3 tw="text-[#A1A8BC]">Environment</h3>
              <div tw="pt-1">
                {tags.otherdeedEnvironment.map((item) => (
                  <label
                    key={item}
                    className="container"
                    tw="mt-3 flex items-center text-base capitalize"
                  >
                    {item}
                    <input id={item} type="checkbox" />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {/* <div tw="px-6 pt-8">
            <h3 tw="text-[#A1A8BC]">Stage</h3>
            <div tw="pt-1">
              {tags.stages.map((item) => (
                <label
                  key={item}
                  className="container"
                  tw="mt-3 flex items-center text-base capitalize"
                >
                  {item}
                  <input type="checkbox" onChange={() => {}} />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
          <div tw="px-6 py-8">
            <h3 tw="text-[#A1A8BC]">Rarity</h3>
            <div tw="pt-1">
              {tags.rarities.map((item) => (
                <label
                  key={item.name}
                  className="container"
                  css={{ color: item.color }}
                  tw="mt-3 flex items-center text-base capitalize"
                >
                  {item.name}
                  <input type="checkbox" onChange={() => {}} />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div> */}
      </div>
      <div tw="px-2 md:px-5 py-8 min-h-[100%]">
        <p tw="pb-8 font-semibold text-[32px]">
          {itemCount}{' '}
          {games.length > 1
            ? getUnit(prefix)?.plural
            : getUnit(prefix)?.singular}
        </p>
        <div tw="flex flex-wrap justify-center content-start gap-x-3 md:gap-x-6 gap-y-4 md:gap-y-6 bg-[#02091B]">
          {games.map((g) => (
            <GameGridCard key={g._id} {...g} prefix={prefix} />
          ))}
        </div>
        <div tw="pt-[46px] flex justify-center items-center gap-4">
          <button
            tw="px-4"
            onClick={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
                setPageNumber1(`${pageNumber - 1}`);
              }
            }}
          >
            <img alt="prev" src={iconPrev} width={11} />
          </button>
          Page
          <input
            tw="w-14 h-9 text-center border border-[#fff4] bg-[#172545] rounded-lg"
            value={pageNumber1}
            onChange={(e) => setPageNumber1(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(pageNumber1);
                setPageNumber(page);
                setPageNumber1(`${page}`);
              }
            }}
          />
          out of {pageCount}
          <button
            tw="px-4"
            onClick={() => {
              if (pageNumber < pageCount) {
                setPageNumber(pageNumber + 1);
                setPageNumber1(`${pageNumber + 1}`);
              }
            }}
          >
            <img alt="next" src={iconNext} width={11} />
          </button>
        </div>
      </div>
      {/* </SplitterLayout> */}
    </div>
  );
};

export default MarketplacePage;

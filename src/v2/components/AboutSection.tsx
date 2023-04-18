import 'twin.macro';

import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <div tw="w-full">
      <div tw="relative flex flex-col justify-center pl-6 pr-6 md:pl-16 w-full h-[765px] md:h-[445px] bg-bottom md:bg-right bg-cover md:bg-transparent bg-banner-mobile-v2 md:bg-banner-desktop-v2">
        {/* <img
          alt="character"
          src={imgCharacter}
          tw="absolute md:hidden left-1/2 translate-x-[-50%] top-[-60px] z-50"
          width={120}
        /> */}
        <p tw="pb-10 absolute md:static max-w-[287px] md:max-w-none top-[118px] md:top-[unset] left-1/2 translate-x-[-50%] md:left-[unset] md:translate-x-[unset] w-full font-lumadFree text-[24px] md:text-[36px] leading-[120%] text-center md:text-left">
          <span
            css={{
              backgroundImage:
                'radial-gradient(39.77% 88.79% at 31.01% 26.72%, #E13656 22.65%, #A237F5 65.85%, #E13656 100%)',
            }}
            tw="font-lumadFree text-[24px] md:text-[36px] leading-[120%] bg-clip-text text-transparent"
          >
            Rent NFTs
          </span>{' '}
          from your
          <br />
          favorite games
        </p>
        <Link
          to="/game/Axie%20Infinity"
          tw="absolute md:relative top-[288px] md:top-[unset] left-1/2 translate-x-[-50%] md:left-[unset] md:translate-x-[unset] px-8 w-[222px] h-[55px] flex items-center uppercase text-white"
        >
          <div tw="absolute left-0 top-0 w-full h-full -skew-x-12 bg-[#D2193A] z-10" />
          <span tw="absolute left-0 top-0 w-full h-full flex justify-center items-center text-[16px] tracking-[0.22em] leading-[23px] z-20">
            See all games
          </span>
        </Link>

        {/* <Link
          to="/game/Axie%20Infinity"
          tw="absolute md:static bottom-10 md:bottom-[unset] left-1/2 translate-x-[-50%] md:left-[unset] md:translate-x-[unset] mx-auto md:mx-0 px-6 py-4 block md:inline-block w-[80%] md:w-[180px] font-semibold text-lg text-center bg-[#35924a] rounded-xl"
        >
          See all games
        </Link> */}
      </div>
    </div>
  );
};

export default AboutSection;

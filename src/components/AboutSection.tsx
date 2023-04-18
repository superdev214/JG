import 'twin.macro';

const AboutSection = () => {
  return (
    <div tw="mx-auto px-0 md:px-2 pt-10 md:pt-4 max-w-[75rem]">
      <div tw="relative flex flex-col justify-center pl-6 pr-6 md:pl-16 w-full h-[430px] bg-left md:bg-center bg-cover md:bg-transparent bg-banner-mobile md:bg-banner-desktop rounded-none md:rounded-xl">
        {/* <img
          alt="character"
          src={imgCharacter}
          tw="absolute md:hidden left-1/2 translate-x-[-50%] top-[-60px] z-50"
          width={120}
        /> */}
        <p tw="pb-10 absolute md:static top-20 md:bottom-[unset] left-1/2 translate-x-[-50%] md:left-[unset] md:translate-x-[unset] w-full font-semibold text-[28px] md:text-5xl leading-[34px] md:leading-[62px] text-center md:text-left">
          Rent NFTs from your
          <br />
          favorite games
        </p>
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

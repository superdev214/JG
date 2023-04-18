import 'twin.macro';

import { useContext } from 'react';

import AboutSection from '../components/AboutSection';
import GameGridSection from '../components/GameGridSection';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../contexts/UserContext';
import { useEagerConnect, useWeb3Listener } from '../hooks';

const Home = () => {
  useEagerConnect();
  useWeb3Listener();
  const { isLoading } = useContext(UserContext);

  return (
    <>
      {isLoading ? (
        <div tw="fixed left-0 top-0 w-full h-full flex justify-center items-center bg-[#0006] z-40">
          <LoadingSpinner />
        </div>
      ) : null}
      <div css={isLoading ? { filter: 'blur(4px)' } : {}} tw="w-full">
        <AboutSection />
        <GameGridSection />
      </div>
    </>
  );
};

export default Home;

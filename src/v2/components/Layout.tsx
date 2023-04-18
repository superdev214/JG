import 'twin.macro';

import { ReactNode, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';
// import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Spinner from './Spinner';

const Layout = ({
  children,
  menuOpened,
  nude,
  onToggleMenu,
}: {
  nude?: boolean;
  children: ReactNode;
  menuOpened: boolean;
  onToggleMenu: () => void;
}) => {
  //   const { pathname } = useLocation();
  const { isLoading } = useContext(UserContext);

  return (
    <>
      <Spinner open={isLoading} />
      <div
        css={{
          filter: isLoading ? 'blur(4px)' : 'none',
        }}
        tw="relative min-h-[100vh] bg-[#070215]"
      >
        {!nude && (
          <Header menuOpened={menuOpened} onToggleMenu={onToggleMenu} />
        )}
        {children}
        {!nude && <Footer />}
      </div>
    </>
  );
};

export default Layout;

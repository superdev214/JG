import 'twin.macro';

import { ReactNode, useContext } from 'react';

import { UserContext } from '../contexts/UserContext';
// import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Spinner from './Spinner';

const Layout = ({
  children,
  menuOpened,
  onToggleMenu,
}: {
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
          background: 'linear-gradient(to right, #1b284f, #02091B, #1b284f)',
          filter: isLoading ? 'blur(4px)' : 'none',
        }}
        tw="relative min-h-[100vh]"
      >
        <Header menuOpened={menuOpened} onToggleMenu={onToggleMenu} />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;

import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tw, { styled } from 'twin.macro';

import imgLogo from '../assets/images/logo-light.png';
import { UserContext } from '../contexts/UserContext';
import { navMenu, navMenuLoggedIn, socialLink } from './Header';

const StyledMenuPanel = styled.div`
  ${tw`relative py-4 w-4/5 h-full bg-[#1b284f] rounded-sm`}
  transform-origin: top left;
  animation: dropdown 0.4s ease-out;

  @keyframes dropdown {
    from {
      transform: scaleX(0);
    }

    to {
      transform: scaleX(1);
    }
  }
`;

const MobileMenu = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { loggedIn, setAuthData, setLoggedIn } = useContext(UserContext);

  return (
    <div
      tw="fixed left-0 top-0 w-full h-full bg-[#0008] z-50"
      onClick={() => onClose()}
    >
      <StyledMenuPanel onClick={(e) => e.stopPropagation()}>
        <div tw="px-10 py-16 border-b border-[#666]">
          <img alt="logo" src={imgLogo} />
        </div>
        <ul>
          {(loggedIn ? navMenuLoggedIn : navMenu).map((item) => (
            <li key={item.title} tw="border-b border-[#666]">
              <Link
                to={item.link}
                tw="py-4 block w-full font-bold text-center text-white hover:bg-[#fff2]"
                onClick={() => onClose()}
              >
                {item.title}
              </Link>
            </li>
          ))}
          {loggedIn ? (
            <li tw="border-b border-[#666]">
              <button
                tw="py-4 block w-full font-bold text-center text-white hover:bg-[#fff2]"
                onClick={() => {
                  window.localStorage.removeItem('accessToken');
                  window.localStorage.removeItem('refreshToken');
                  setAuthData(undefined);
                  setLoggedIn(false);
                  onClose();
                  navigate('/');
                }}
              >
                Sign Out
              </button>
            </li>
          ) : null}
        </ul>
      </StyledMenuPanel>
    </div>
  );
};

export default MobileMenu;

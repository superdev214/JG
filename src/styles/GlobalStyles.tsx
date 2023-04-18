import { createGlobalStyle } from 'styled-components';
import tw, { GlobalStyles as BaseStyles, theme } from 'twin.macro';

import Fonts from './Fonts';

const CustomStyles = createGlobalStyle`
  html {
    scroll-behavior: smooth;
  }

  body {
    -webkit-tap-highlight-color: ${theme<string>`colors.purple.500`};
    ${tw`font-lores12 antialiased`}
  }

  * {
    font-family: inherit;
    ${tw`text-base text-white`}
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    border-radius: 6px;
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #0C1938;
    box-shadow: inset 0 0 4px #fff2;
  }

  .Toastify * {
    ${tw`text-black`}
  }
`;

const GlobalStyles = () => (
  <>
    <Fonts />
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;

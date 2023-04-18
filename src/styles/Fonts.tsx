import { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`
@font-face {
  font-family: 'lumad-free';
  font-weight: 400;
  src: url('/fonts/lumad-free.ttf') format('truetype');
}

@font-face {
  font-family: "Roslindale Display Bold";
  src: url('/fonts/roslindale_display_bold.woff2') format('woff2'),
  url('/fonts/roslindale_display_bold.woff') format('woff');
  font-style: normal;
  font-weight: bold;
  font-display: swap;
}

@font-face {
  font-family: "Display Narrow Bold Roslindale";
  src: url('/fonts/roslindale_display_narrow.woff2') format('woff2'),
  url('/fonts/roslindale_display_narrow.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Text Pro";
  src: url('/fonts/NHaasGroteskTXStd-55Rg.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-55Rg.woff') format('woff');
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Text Pro";
  src: url('/fonts/NHaasGroteskTXStd-56It.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-56It.woff') format('woff');
  font-style: italic;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Text Pro";
  src: url('/fonts/NHaasGroteskTXStd-75Bd.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-75Bd.woff') format('woff');
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Display Pro";
  src: url('/fonts/NHaasGroteskTXStd-65Md.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-65Md.woff') format('woff');
  font-style: normal;
  font-weight: medium;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Display Pro";
  src: url('/fonts/NHaasGroteskTXStd-66MdIt.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-66MdIt.woff') format('woff');
  font-style: italic;
  font-weight: medium;
  font-display: swap;
}

@font-face {
  font-family: "Neue Haas Grotesk Display Pro";
  src: url('/fonts/NHaasGroteskTXStd-76BdIt.woff2') format('woff2'),
  url('/fonts/NHaasGroteskTXStd-76BdIt.woff') format('woff');
  font-style: italic;
  font-weight: 700;
  font-display: swap;
}
`;

export default Fonts;

import 'twin.macro';

import { Link } from 'react-router-dom';

import imgLogo from '../assets/images/logo-light.png';
import { socialLink } from './Header';

const pageLinks = [
  {
    link: 'https://apply.joystickgames.com/',
    title: 'Loan/Borrow',
  },
  // {
  //   link: 'https://education.joystickgames.com/',
  //   title: 'Education',
  // },
  {
    link: 'https://docs.joystickgames.com/',
    title: 'Docs',
  },
  {
    link: 'https://joystickgames.com/what-is-joystick/',
    title: 'What is Joystick',
  },
];

const Footer = () => {
  return (
    <footer tw="w-full">
      <div tw="mx-auto px-2 py-10 w-full max-w-[75rem] flex flex-col md:flex-row md:justify-between items-center md:items-start gap-8">
        <a href="#top">
          <img alt="logo" src={imgLogo} tw="max-w-[128px]" />
          <p tw="pt-6 text-xs text-[#8794B4]">
            Copyright 2021-{new Date().getFullYear()} &copy;
          </p>
        </a>
        <ul tw="flex gap-4">
          {pageLinks.map((item) => (
            <li key={item.title}>
              <a href={item.link}>{item.title}</a>
            </li>
          ))}
        </ul>
        <div tw="flex flex-col items-center md:items-end gap-4">
          <ul tw="flex gap-6">
            {socialLink.map((item) => (
              <li
                key={item.title}
                title={item.title}
                tw="w-7 h-7 rounded-full hover:opacity-75"
              >
                <a
                  href={item.link}
                  rel="noreferrer"
                  target="_blank"
                  tw="w-full h-full flex justify-center items-center uppercase text-white hover:underline"
                >
                  <img
                    alt={item.title}
                    src={item.icon}
                    tw="object-center"
                    width={28}
                  />
                </a>
              </li>
            ))}
          </ul>
          <div tw="flex gap-5">
            <Link to="/tac" tw="text-xs text-[#8794B4]">
              Terms and Conditions
            </Link>
            <Link to="/privacy-policy" tw="text-xs text-[#8794B4]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

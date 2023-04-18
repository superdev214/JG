import axios, { AxiosResponse } from 'axios';
import qs from 'qs';

import {
  AuthResultData,
  I2faSecret,
  IGame,
  IProduct,
  IProductsListResponse,
  IVerifyTotpParam,
  PasswordUpdateParam,
  ResetPasswordParam,
  ResetPasswordReqParam,
  User,
  VerifyEmailParam,
} from '../type.d';

let instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 15000,
});

export function setAuthHeader(token: string) {
  instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
    timeout: 15000,
  });
}

instance.interceptors.request.use(function (config) {
  const access_token = window.localStorage.getItem('accessToken');
  if (access_token) {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };
  }

  return config;
});

const responseBody = (response: AxiosResponse) => response.data;

const errBody = (err: any) => {
  if (
    err.response.status === 401 &&
    window.location.pathname.indexOf('/login') < 0 &&
    window.location.pathname.indexOf('/signup') < 0 &&
    window.location.pathname.indexOf('/register') < 0 &&
    window.location.pathname.indexOf('/verify-email') < 0 &&
    window.location.pathname.indexOf('/enable-2fa') < 0 &&
    window.location.pathname.indexOf('/verify-2fa') < 0 &&
    window.location.pathname.indexOf('/forgot-password') < 0 &&
    window.location.pathname.indexOf('/reset-password') < 0
  ) {
    window.localStorage.removeItem('auth');
    document.location = '/login';
  }
  throw err;
};

const requests = {
  delete: (url: string) => instance.delete(url).then(responseBody),
  get: (url: string, body?: any) => {
    let endpoint = url;
    if (body) endpoint += `?${qs.stringify(body)}`;
    return instance.get(endpoint, body).then(responseBody).catch(errBody);
  },
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
};
export default requests;

export const Auth = {
  changePassword: (payload: PasswordUpdateParam): Promise<boolean> =>
    requests.post('auth/password/change-password', payload),
  checkPassword: (param: { password: string }): Promise<boolean> =>
    requests.post('auth/password/check-password', param),
  disable2fa: (payload: IVerifyTotpParam): Promise<AuthResultData> =>
    requests.post('auth/verification/totp/deactivate', payload),
  disable2faSimply: (): Promise<AuthResultData> =>
    requests.post('auth/verification/totp/deactivate', {}),
  enable2fa: (): Promise<I2faSecret> =>
    requests.get('auth/verification/totp/secret', {}),
  enable2faSimply: (): Promise<AuthResultData> =>
    requests.post('auth/verification/totp/activate', {}),
  login: (user: any): Promise<AuthResultData> =>
    requests.post('auth/login', user),
  loginByToken: (): Promise<User> => requests.get('auth/me', {}),
  register: (user: any): Promise<AuthResultData> =>
    requests.post('auth/register', user),
  resetPassword: (param: ResetPasswordParam): Promise<boolean> =>
    requests.post('auth/password/reset-password', param),
  resetPasswordEmail: (param: ResetPasswordReqParam): Promise<AuthResultData> =>
    requests.post('auth/password/reset-password-email', param),
  verify2fa: (payload: IVerifyTotpParam): Promise<AuthResultData> =>
    requests.post('auth/verification/totp/verify', payload),
  verifyEmail: (param: VerifyEmailParam): Promise<boolean> =>
    requests.post('auth/verification/email/verify', param),
  verifyEmailResend: (): Promise<boolean> =>
    requests.post('auth/verification/email/resend', {}),
};

export const UserApi = {
  unsubscribe: (userId: string): Promise<any> =>
    requests.put(`user/unsubscribe/${userId}`, {}),
  update: (id: string, payload: any): Promise<any> =>
    requests.put(`user/${id}`, payload).catch(errBody),
};

export const OrderApi = {
  addCart: (payload: { product: string; quantity?: number }): Promise<any> =>
    requests.post('order/cart', payload),
  cart: (payload?: any): Promise<any> =>
    requests.get('order/mycart', payload).catch(errBody),
  getAll: (payload?: any): Promise<any> =>
    requests.get('order/me', payload).catch(errBody),
  removeCart: (id: string): Promise<any> =>
    requests.get(`order/cart/remove/${id}`).catch(errBody),
};

export const MarketplaceApi = {
  getProductById: (id: string): Promise<IProduct> =>
    requests.get(`product/${id}`),
  listGames: (): Promise<IGame[]> => requests.get('game'),
  listProducts: (
    name: string,
    page: number = 0,
    size: number = 16,
    keyword: string = '',
    categories: string[] = [],
    classes: string[] = [],
    price: number[] = [0, 1000]
  ): Promise<IProductsListResponse> => {
    const paramCategories = categories.join('&categories=');
    const paramClasses = classes.join('&classes=');
    return requests.get(
      `product?game=${name}&page=${page}&size=${size}&keyword=${keyword}&categories=${paramCategories}&classes=${paramClasses}&price=${price[0]}&price=${price[1]}`
      // `product?game=${name}&page=${page}&size=${size}&keyword=${keyword}&categories=${paramCategories}&classes=${paramClasses}`
    );
  },
};

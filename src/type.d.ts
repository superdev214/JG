export interface User {
  username: string;
  password: string;
  email?: string;
  role?: string;
  username: string;
  contactNumber?: string;
  discordUsername?: string;
  twitterUsername?: string;
  inGameUsername?: string;
  walletAddress?: string;
  created: Date;
  updated: Date;
  __v: number;
  _id: string;
  verification: {
    totp: {
      enabled: boolean;
      secret: string;
      tmpSecret: string;
    };
    email: {
      code: string;
      codeExpiration: Date;
      isVerified: boolean;
    };
    phone: {
      code: string;
      codeExpiration: Date;
      isVerified: boolean;
    };
  };
}

export interface AuthResultData {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface PasswordUpdateParam {
  email: string;
  currentPwd: string;
  newPwd: string;
}

export interface VerifyEmailParam {
  code: string;
}

export interface ResetPasswordReqParam {
  email: string;
  role: string;
}

export interface ResetPasswordParam {
  code: string;
  newPassword: string;
  repeatNewPassword: string;
}

export interface I2faSecret {
  ascii: string;
  hex: string;
  base32: string;
  otpauth_url: string;
}

export interface IVerifyTotpParam {
  userToken: string;
}

export interface IGame {
  _id: string;
  name: string;
  image?: string;
  created?: Date;
  updated?: Date;
  productUnit?: {
    singular: string;
    plural: string;
  };
}

export interface IProduct {
  _id: string;
  axie: {
    id: string;
    __typename: string;
    bodyShape: string;
    breedCount: number;
    class: string;
    image: string;
    level: 1;
    name: string;
    title: string;
    owner: string;
    parts: {
      id: string;
      __typename: string;
      class: string;
      type: string;
      image: string;
      name: string;
      specialGenes: string;
      stage: number;
    }[];
  };
  category: string;
  game: string;
  images: string[];
  potential_discount: number;
  potential_earnings: number;
  description_text1?: string;
  description_text2?: string;
  price: number;
  product_name: string;
  stats: string[];
  created: Date;
  updated: Date;
}

export interface IProductsListResponse {
  itemCount: number;
  items: IProduct[];
  page: number;
  pageCount: number;
  size: number;
}

export interface IOrder {
  _id: string;
  billing_first_name?: string;
  billing_last_name?: string;
  billing_nick_name?: string;
  billing_email?: string;
  billing_country?: string;
  billing_street_address?: string;
  billing_street_address1?: string;
  billing_city?: string;
  billing_state?: string;
  billing_post_code?: string;
  billing_phone?: string;
  type?: string;
  status: string;
  product?: IProduct;
  user?: User;
  quantity: number;
  total_price?: number;
  created?: Date;
  expired?: Date;
  updated?: Date;
  purchased?: Date;
  checkout_session?: string;
  show_in_cart?: boolean;
}

export interface ICartItem {
  _id: string;
  created: Date;
  updated: Date;
  product: IProduct;
  quantity: number;
  status: string;
  user: string;
}

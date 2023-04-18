import games from '../data/games.json';

export interface GameItem {
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
  detail?: any;
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

export function getPrefixByKey(key: string): string | null {
  const res = games.find((item) => item.key === key);
  if (res) {
    return res.prefix;
  }
  return null;
}

export function classToColorNumber(cls: string): number {
  switch (cls) {
    case 'aquatic':
      return 5;
    case 'beast':
      return 2;
    case 'bird':
      return 1;
    case 'bug':
      return 3;
    case 'dawn':
      return 5;
    case 'dusk':
      return 1;
    case 'mech':
      return 5;
    case 'plant':
      return 4;
    case 'reptile':
      return 6;
  }
  return 1;
}

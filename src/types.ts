
export type UserType = "customer" | "farmer";

export interface TokenPayload {
  aud: string;
  iat: number;
  iss: string;
  type: UserType;
  userid: string;
  usercode: string;
  username: string;
  name: string;
}

export interface Profile {
  id: string;
  code: string;
  username: string;
  email: string;
  mobile: string;
  name: string;
  gender: string;
  birthday: string;
  type: UserType;
  addressstreet: string;
  addresspurok: string;
  addressbrgy: string;
}

export interface Farmer extends Profile {
  products: string;
  transactions: string;
}

export type Category = "vegetable" | "root-crops" | "fruits";

export interface Product {
  id: string;
  name: string;
  user: string;
  category: Category;
  description: string;
  code: string;
  created: string;
  edited: string;
  price: string;
  photos: string[];
}

export interface Stock {
  date: string;
  quantity: number;
}

export interface ProductStock extends Product {
  stocksIn: Stock[];
  stocksOut: Stock[];
  currentStocks: number;
}

export interface CartItem {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  product: {
    id: string;
    name: string;
    user: string;
    category: string;
    description: string;
    price: string;
    photos: string[];
  };
  quantity: string;
  date: string;
}

export interface Transaction {
  id: string;
  code: string;
  user: {
    id: string;
    name: string;
    username: string;
    addressstreet: string;
    addresspurok: string;
    addressbrgy: string;
  };
  product: {
    id: string;
    name: string;
    description: string;
    user: string;
    price: string;
    photos: string[];
  };
  quantity: string;
  date: string;
  shipping: string;
  amount: string;
  paymentoption: string;
  status: string;
}

export interface QnA {
  section: string;
  question: string;
  answer: string;
}

export interface RouterProps {
  match: any;
  location: any;
  history: any;
}

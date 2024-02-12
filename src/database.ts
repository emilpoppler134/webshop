import { API_ADDRESS } from './config';

/* SECTIONS, CATEGORIES, COLLECTIONS */

interface ISection {
  _id: string;
  name: string,
  categories: Array<ICategory>
  featured: Array<IFeatured>
}

interface ICategory {
  _id: string;
  name: string,
  parent: string,
  collections: Array<ICollection>
}

interface ICollection {
  _id: string;
  name: string,
  views: number,
  parent: string,
}

interface IFeatured {
  name: string,
  href: string,
  image: string,
  alt: string
}

export async function fetchSections(): Promise<Array<ISection> | null> {
  try {
    const response: Response = await fetch(`${API_ADDRESS}/sections/`, {method: "GET"});
    return response.ok ? await response.json() : null;
  } catch(err) { return null; }
}

/* PRODUCTS, STOCKS */

interface IProduct {
  _id: string;
  name: string;
  articleNumber: number;
  stock: Array<IStock>;
  image: IImage;
  collections: Array<ICollection>;
  views: number;
  timestamp: Date;
}

export interface IStock {
  _id: string;
  product: string;
  size: string;
  price: number;
  quantity: number;
}

interface IImage {
  key: string;
  type: string;
}

interface IStockExtended extends Omit<IStock, 'product'> {
  product: IProduct;
}

export async function fetchProducts(): Promise<Array<IProduct> | null> {
  try {
    const response: Response = await fetch(`${API_ADDRESS}/products/`, {method: "GET"});
    return response.ok ? await response.json() : null;
  } catch(err) { return null; }
}

export async function fetchProduct(id: string): Promise<IProduct | null> {
  try {
    const response: Response = await fetch(`${API_ADDRESS}/products/${id}`, {method: "GET"});
    return response.ok ? await response.json() : null;
  } catch(err) { return null; }
}

export async function fetchProductsByStockId(cart: Array<string>): Promise<Array<IStockExtended> | null> {
  try {
    const response: Response = await fetch(`${API_ADDRESS}/stock/${cart.join(",")}`, {method: "GET"});
    return response.ok ? await response.json() : null;
  } catch(err) { return null; }
}

/* PAYLOAD, STATUS */
interface IPayload {
  products: Array<string>;
  promotionCode: string | null;
  customer: ICustomerParams;
  shipping: IShippingParams;
  payment: ICardParams;
}

interface ICustomerParams {
  name: string;
  email: string;
  phone: string;
  billing: IAddressParams;
}

interface IAddressParams {
  line1: string;
  line2: string | null;
  postal_code: string;
  city: string;
  state: string | null;
  country: string;
}

interface IShippingParams {
  name: string;
  phone: string;
  address: IAddressParams;
}

interface ICardParams {
  cc_name: string;
  cc_number: string;
  exp_month: string;
  exp_year: string;
  cc_csc: string;
}

interface IStatus {
  status: EStatus;
  data?: any;
  error?: any;
}

enum EStatus {
  OK = "OK",
  ERROR = "ERROR"
}

export async function sendPayment(payload: IPayload): Promise<IStatus | null> {
  try {
    const options: RequestInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    const response: Response = await fetch(`${API_ADDRESS}/checkout/charge`, options);
    return response.ok ? await response.json() : null;
  } catch(err) { return null; }
}


export type { ISection, IProduct, IStockExtended, IPayload, IStatus }
export default { fetchSections, fetchProducts, fetchProductsByStockId, fetchProduct, sendPayment }

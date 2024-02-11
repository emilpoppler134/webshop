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
  productID: string;
  size: string;
  price: number;
  quantity: number;
}

interface IImage {
  key: string;
  type: string;
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

export type { ISection, IProduct }
export default { fetchSections, fetchProducts, fetchProduct }

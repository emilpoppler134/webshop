import { API_ADDRESS } from './config';

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

export type { ISection }
export default { fetchSections }

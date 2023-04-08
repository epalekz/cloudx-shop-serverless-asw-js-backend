import { Stock } from "./stock";
export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
}

export interface Book extends Product {
  author: string;
  publisher: string;
  publicationDate: string;
}

export type BookStock = Book & Omit<Stock, "productId">;

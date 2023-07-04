export type Customer = {
  customer_id: number;
  store_id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  address_id?: number;
  activebool?: boolean;
  create_date?: string;
  last_update?: string;
  active?: boolean;
}

export type Film = {
  film_id: number;
  title?: string;
  description?: string;
  release_year?: number;
  language_id?: number;
  rental_duration?: number;
  rental_rate?: number;
  length?: number;
  replacement_cost?: number;
  rating?: string;
  last_update?: string;
  special_features?: string;
  fulltext?: string;
}

export type Category = {
  category_id: number;
  name?: string;
  last_update?: string;
}

export type Address = {
  address_id: number;
  address?: string;
  address2?: string;
  district?: string;
  city_id?: number;
  postal_code?: number;
  phone?: number;
  last_update?: string;
}

export type Store = {
  store_id: number;
  manager_staff_id?: number;
  address_id?: number;
  last_update?: string;
}

export type Rental = {
  rental_id: number;
  rental_date?: number;
  inventory_id?: number;
  customer_id?: number;
  return_date?: number;
  staff_id?: number;
  last_update?: string;
}

export type RentalFilmPayment = {
  film: Film;
  payment: Payment;
  rental: Rental;
}

export type Payment = {
  payment_id: number;
  customer_id?: number;
  rental_id?: number;
  amount: number;
  payment_date?: string;
}

export type FilmCategory = {
  film: Film;
  category: Category;
}


export type FilmCategoryStores = {
  film: Film;
  category: Category;
  stores: Store[];
}


export type FilmCategoryList = {
  films: FilmCategoryStores[];
}


export type StoreOccurrence = {
  store: Store;
  address: Address;
  num_film: number;
}

export type User = {
  customer_id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

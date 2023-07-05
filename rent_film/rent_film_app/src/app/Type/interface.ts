//QUERY
// Crea un tipo per rappresentare la risposta della query GraphQL
export interface FilmsCategoryResponse {
  films: FilmCategory[];
  searchFilmsByCategory : FilmCategory[]
  searchFilm : FilmCategory[]
}

export interface CategoryResponse {
  categories: Category[];
}

export interface RentalResponse {
  rentalsByCustomer: RentalFilmPayment[];
}






//COMPONENTS

export interface Film {
  film_id: number;
  title: string;
  description: string;
  release_year: number;
  language_id: number;
  rental_duration: number;
  rental_rate: number;
  length: number;
  rating: string;
  last_update: string;
}

export interface Category {
  name: string;
}

export interface Address {
  address: string;
}

export interface Store {
  store_id: number
  manager_staff_id: number
  address_id: number
  last_update: String
}


export interface StoreOccorrency {
  store: Store
  address: Address;
  num_film: number;
}

export interface FilmCategoryStore {
  film: Film;
  category: Category;
  stores: StoreOccorrency[];
}

export interface FilmCategory {
  film: Film;
  category: Category;
}

export interface Payment {
  payment_id: number;
  customer_id: number;
  rental_id: number;
  amount: number;
  payment_date: string;
}

export interface Rental {
  rental_id: number;
  rental_date: number;
  inventory_id: number;
  customer_id: number;
  return_date: number;
  staff_id: number;
  last_update: string;
}

export interface RentalFilmPayment {
  film: Film;
  payment: Payment;
  rental: Rental;
}

import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular'; // Import gql from the correct package
import { BehaviorSubject, Observable} from "rxjs";

// injectable vuol dire che è iniettabile, ovvero che possiamo
// iniettare il nostro service 'in giro' all'applicazione

//il service è il cervello dell'applicazione

// provide in : ovvero dove è stato messo a disposizione, in
//questo caso dalla root in poi, ma potevamo specificare da un determinato punto
@Injectable({
  providedIn: 'root'
})

export class ServiceRentService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private themeSubject = new BehaviorSubject<string>('theme1-toolbar');
  public theme$ = this.themeSubject.asObservable();
  private film: any;
  private stores: any[] =[];


  changeTheme(theme: string) {
    this.themeSubject.next(theme);
  }

  constructor(private apollo: Apollo) {}

  getFilms(): Observable<any>{
    return this.apollo.query<any>({
      query: gql`
        query {
          films {
            film{
              film_id
              title
              description
              release_year
              language_id
              rental_duration
              rental_rate
              length
              rating
              last_update
            }
            category {
              name
            }
          }
        }
      `
    });
  }


  getCategories(): Observable<any>{
    return this.apollo.query<any>({
      query: gql`
        query {
          categories {
            name
          }
        }
      `
    });
  }

  searchFilms(searchTerm: string): Observable<any> {
    const SEARCH_FILMS_QUERY = gql`
      query SearchFilms($searchTerm: String!) {
        searchFilms(term: $searchTerm) {
          film_id
          title
          description
          release_year
          language_id
          rental_duration
          rental_rate
          length
          rating
          last_update
        }
        category{
          name
        }
      }
    `;

    return this.apollo.query({
      query: SEARCH_FILMS_QUERY,
      variables: {
        searchTerm: searchTerm
      }
    });
  }

  searchFilmsByCategory(category: string): Observable<any> {
    const SEARCH_FILMS_BY_CATEGORY = gql`
      query SearchFilms($searchCategory: String!) {
        searchFilmsByCategory(category: $searchCategory) {
          film_id
          title
          description
          release_year
          language_id
          rental_duration
          rental_rate
          length
          rating
          last_update
        }
        category {
          name
        }
      }
    `;

    return this.apollo.query({
      query: SEARCH_FILMS_BY_CATEGORY,
      variables: {
        searchCategory: category
      }
    });
  }

  getStores(film_id: any): Observable<any>{
    const StoreQuery = gql`
    query FindStoresByFilmId($filmId: ID!) {
      stores(film_id: $filmId) {
        store{
          store_id
        }
        address {
          address
        }
        num_film
      }
    }
    `;

    return this.apollo.query({
      query: StoreQuery ,
      variables: {
        filmId : film_id
      }
    });
  }

  // Return User rentals list
  getRentalsByCustomer(customer_id: any): Observable<any>{

    const User_Rentals = gql`
    query {
      rentalsByCustomer(customerId: 534) {
        film {
          title
        }
        payment {
          amount
        }
        rental {
          rental_date
          return_date
          rental_id
        }
      }
    }
   `;
    return this.apollo.query({
      query: User_Rentals,
      variables: {
        customerId: customer_id
      }
    });
  }


}

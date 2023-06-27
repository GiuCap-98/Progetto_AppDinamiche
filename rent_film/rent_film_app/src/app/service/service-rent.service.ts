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
            film_id
            title
            description
            release_year
            language_id
            rental_duration
            rental_rate
            length
            replacement_cost
            rating
            special_features
            fulltext
            last_update
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
          rating
          rental_rate
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

  getStores(film_id: any): Observable<any>{
    const StoreQuery = gql`
    query FindStoresByFilmId($filmId: ID!) {
      stores(film_id: $filmId) {
        store_id
        address
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
        rental_date
        return_date
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

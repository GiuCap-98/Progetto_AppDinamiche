import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular'; // Import gql from the correct package
import { BehaviorSubject, Observable} from "rxjs";

import { ApolloQueryResult } from '@apollo/client/core';
import { CategoryResponse, FilmsCatLangResponse, RentalResponse, Tot_Films } from '../Type/interface';


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
  getNumFilms(): any {
    const query = gql`
      query {
        totalFilms
      }
    `;
    return this.apollo.query({ query });
  }



  getFilmsPr(): Observable<ApolloQueryResult<FilmsCatLangResponse>>{
    return this.apollo.query<FilmsCatLangResponse>({
      query: gql`
        query {
          films {
            film{
              film_id
              title
              description
              release_year
              rental_duration
              rental_rate
              length
              rating
              last_update
            }
            category {
              name
            }
            language {
              name
            }
          }
        }
      `
    });
  }


  getFilms(page:number, pageSize:number): Observable<ApolloQueryResult<FilmsCatLangResponse>>{
    const FilmQuery = gql`
    query GetFilms($page: Int!, $pageSize: Int!) {
      films(page: $page, pageSize: $pageSize) {
        film {
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
        language {
          name
        }
        actor {
          first_name
          last_name
        }
      }
    }
  `;
    return this.apollo.query<FilmsCatLangResponse>({
      query: FilmQuery ,
      variables: {
        page: page,
        pageSize: pageSize
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
 /*
  getFilms_Cat_Store(): Observable<ApolloQueryResult<FilmsCatStoresResponse>>{
      return this.apollo.query<FilmsCatStoresResponse>({
        query: gql`
          query {
            films_cat_stores {
              film {
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
              stores {
                address {
                  address
                }
                num_film
              }
            }
          }
        `
      });
    }

    */

  getCategories(): Observable<ApolloQueryResult<CategoryResponse>>{
    return this.apollo.query<CategoryResponse>({
      query: gql`
        query {
          categories {
            name
          }
        }
      `
    });
  }

  searchFilms(searchTerm: string): Observable<ApolloQueryResult<FilmsCatLangResponse>> {
    const SEARCH_FILMS_QUERY = gql`
      query SearchFilms($searchTerm: String!) {
        searchFilms(searchTerm: $searchTerm) {
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
          category{
            name
          }
      }
    }
    `;

    return this.apollo.query<FilmsCatLangResponse>({
      query: SEARCH_FILMS_QUERY,
      variables: {
        searchTerm: searchTerm
      }
    });
  }

  searchFilmsByCategory(name_category: string): Observable<ApolloQueryResult<FilmsCatLangResponse>> {
    const SEARCH_FILMS_BY_CATEGORY = gql`
      query SearchFilms($searchCategory: String!) {
        searchFilmsByCategory(category: $searchCategory) {
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
    `;

    return this.apollo.query<FilmsCatLangResponse>({
      query: SEARCH_FILMS_BY_CATEGORY,
      variables: {
        searchCategory: name_category
      }
    });
  }


  // Return User rentals list
  getRentalsByCustomer(customer_id: number): Observable<ApolloQueryResult<RentalResponse>>{

    const User_Rentals = gql`
    query {
      rentalsByCustomer(customerId: 534) {
        film {
          title
        }
        address {
          address
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
    return this.apollo.query<RentalResponse>({
      query: User_Rentals,
      variables: {
        customerId: customer_id
      }
    });
  }


}

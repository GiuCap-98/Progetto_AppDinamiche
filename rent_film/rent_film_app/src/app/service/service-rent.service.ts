import { Injectable, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular'; // Import gql from the correct package
import { BehaviorSubject, Observable} from "rxjs";

import { ApolloQueryResult } from '@apollo/client/core';
import { ActorsResponse, CategoryResponse, FilmsCatLangResponse, RentalResponse, Tot_Films } from '../Type/interface';


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


  changeTheme(theme: string) {
    this.themeSubject.next(theme);
  }

  constructor(private apollo: Apollo) {}
  getNumFilms(searchCat: string, searchTerm: string): Observable<ApolloQueryResult<Number>> {
    const NumFilmsQuery = gql`
    query GetNumFilms($searchCat: String!, $searchTerm: String!) {
      totalFilms(searchCat: $searchCat, searchTerm: $searchTerm)
    }
    `;
    return this.apollo.query<Number>({
      query: NumFilmsQuery,
      variables: {
        searchCat: searchCat,
        searchTerm: searchTerm
      }
    });
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

  getFilms(searchCat: string, searchTerm: string, page: number, pageSize: number): Observable<ApolloQueryResult<FilmsCatLangResponse>> {
    const FilmQuery = gql`
      query GetFilms($searchCat: String!, $searchTerm: String!, $page: Int!, $pageSize: Int!) {
        films(searchCat: $searchCat, searchTerm: $searchTerm, page: $page, pageSize: $pageSize) {
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
        }
      }
    `;

    return this.apollo.query<FilmsCatLangResponse>({
      query: FilmQuery,
      variables: {
        searchCat: searchCat,
        searchTerm: searchTerm,
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

  getActors(film_id: number): Observable<any>{
    const SEARCH_ACTORS_BY_FILM = gql`
      query SearchActors($film_id: ID!) {
        searchActorsByFilm(film_id: $film_id) {
          first_name
          last_name
        }
    }
    `;
    return this.apollo.query({
      query: SEARCH_ACTORS_BY_FILM,
      variables: {
        film_id: film_id
      }
    });
  }

  searchFilms(searchTerm: string, page:number, pageSize:number): Observable<ApolloQueryResult<FilmsCatLangResponse>> {
    const SEARCH_FILMS_QUERY = gql`
      query SearchFilms($searchTerm: String!, $page: Int!, $pageSize: Int!) {
        searchFilms(searchTerm: $searchTerm, page: $page, pageSize: $pageSize) {
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
          category{
            name
          }

          language {
            name
          }
      }
    }
    `;

    return this.apollo.query<FilmsCatLangResponse>({
      query: SEARCH_FILMS_QUERY,
      variables: {
        searchTerm: searchTerm,
        page: page,
        pageSize: pageSize
      }
    });
  }

  searchFilmsByCategory(name_category: string, page:number, pageSize:number): Observable<ApolloQueryResult<FilmsCatLangResponse>> {
    const SEARCH_FILMS_BY_CATEGORY = gql`
      query SearchFilms($searchCategory: String!,  $page: Int!, $pageSize: Int!) {
        searchFilmsByCategory(category: $searchCategory, page: $page, pageSize: $pageSize) {
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
    `;

    return this.apollo.query<FilmsCatLangResponse>({
      query: SEARCH_FILMS_BY_CATEGORY,
      variables: {
        searchCategory: name_category,
        page: page,
        pageSize: pageSize
      }
    });
  }


  // Return User rentals list
  getRentalsByCustomer(customer_id: number): Observable<ApolloQueryResult<RentalResponse>>{

    const User_Rentals = gql`
    query{
      rentalsByCustomer(customerId: 1) {
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
        customer_id: customer_id
      }
    });
  }


}

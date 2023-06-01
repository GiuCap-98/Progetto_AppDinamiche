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
  private loggedIn = new BehaviorSubject<boolean>(false);

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

  login(): void {
    // Effettua le operazioni di login, ad esempio chiamando un'API o verificando le credenziali
    // ...

    // Dopo aver effettuato il login con successo, imposta il flag loggedIn a true
    this.loggedIn.next(true);
  }


  logout(): void {
    // Effettua le operazioni di logout
    // ...

    // Dopo aver effettuato il logout, imposta il flag loggedIn a false
    this.loggedIn.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }


  setValue(value: boolean) {
    this.loggedIn.next(value);
  }

  getValue() {
    return this.loggedIn.asObservable();
  }
}

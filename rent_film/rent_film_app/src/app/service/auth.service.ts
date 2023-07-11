import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import jwt_decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'token';

  constructor(
    public apollo: Apollo,
    private _router: Router
    ) {}

  // Il token viene salvato nel localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Recupera il token da localstorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Verifica se l'utente ha un token associato
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token; // Restituisce true se il token esiste, altrimenti false
  }

  // Effettua il Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._router.navigate(['']);
  }

  // Controlla se il token è attivo
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const currentTimestamp: number = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTimestamp;
    }
    return false;
  }

  checkTokenExpiration(): void {
    if (this.isTokenExpired()) {
      // Token scaduto, si viene reindirizzati alla login
      alert('Token scaduto. Sarai reindirizzato al login.');      this.logout();
      this.logout()
    }
  }

  getIdToken(): number {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return decodedToken.customer_id;
    }
    return 0
  }

  // Mutation graphql: registrazione e login
  register(user: any): Observable<any> {
    const register = gql`
    mutation RegisterUser($customer_id: ID!, $first_name: String!, $last_name: String!, $email: String!, $password: String!) {
      register(
        customer_id: $customer_id
        first_name: $first_name
        last_name: $last_name
        email: $email
        password: $password
      ) {
        customer_id
        first_name
        last_name
        email
      }
    }
    `;
      return this.apollo.mutate({
      mutation: register ,
      variables: {
        customer_id: user.customer_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password
      }
    });
  }


  login(email: string, password: string): Observable<any> {
    const register = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;
      return this.apollo.mutate({
      mutation: register ,
      variables: {
        email,
        password
      }
    });
  }
}

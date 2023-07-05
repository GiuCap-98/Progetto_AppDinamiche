import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper: JwtHelperService;

  constructor(public apollo: Apollo) {
    this.jwtHelper = new JwtHelperService();
  }

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
      mutation: register,
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
    const login = gql`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password)
      }
    `;
    return this.apollo.mutate({
      mutation: login,
      variables: {
        email,
        password
      }
    });
  }

  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null && !this.jwtHelper.isTokenExpired(token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

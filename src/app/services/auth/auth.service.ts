import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8094/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signin',
      {
        email,
        password
      },
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true
      }
    )
  }

  logout(): Observable<any> {
    return this.http.post(
      AUTH_API + '/signout',
      {},
      {
        withCredentials: true
      }
    )
  }

  refreshToken(): Observable<any> {
    return this.http.post(
      AUTH_API + '/refreshtoken',
      {},
      {
        withCredentials: true
      }
    )
  }

}

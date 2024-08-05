import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../pages/employees/employees.component';

const AUTH_API = 'http://localhost:8094/api/auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // withCredentials: true
};

export interface User {
  id: number,
  name: string,
  email: string,
  roles: string,
  password: string,
  employee: Employee
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(AUTH_API + '/user/all', { withCredentials: true });
  }

  save(user: User): Observable<any> {
    return this.http.post(AUTH_API + '/user/save', user, { withCredentials: true });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(AUTH_API + '/user/delete/' + id, { withCredentials: true });
  }

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

  signup(name: string, password: string, email: string, roles: string): Observable<any> {
    return this.http.post(
      AUTH_API + '/signup',
      {
        name,
        password,
        email,
        roles
      },
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

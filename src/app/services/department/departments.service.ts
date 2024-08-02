import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../../pages/departments/departments.component';


@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private depUrl = 'http://localhost:8094/api/department';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  }
  constructor() { }

  private setHttpOptions(): any {
    const token = localStorage.getItem("token");
    if (token) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Use Bearer authentication scheme
        }),
        withCredentials: true,
      }; 
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
      };
    }
  }

  getAll(): Observable<Department[]> {
    this.setHttpOptions();
    return this.http.get<Department[]>(`${this.depUrl}/all`, this.httpOptions)
  }

  add(dep: any): Observable<Department> {
    this.setHttpOptions();
    return this.http.post<Department>(`${this.depUrl}/add`, dep , this.httpOptions);
  }

  update(dep: any): Observable<Department> {
    this.setHttpOptions();
    return this.http.put<Department>(`${this.depUrl}/update`, dep, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    this.setHttpOptions();
    return this.http.delete<any>(`${this.depUrl}/delete/${id}`, this.httpOptions);
  }
}

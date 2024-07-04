import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

interface Department {
  departmentId: number;
  departmentName: string;
  description: string;
  managerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private depUrl = 'http://localhost:8094/api/department';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor() { }

  private setHttpOptions(): any {
    const token = localStorage.getItem("token");
    if (token) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Use Bearer authentication scheme
        })
      }; 
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
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

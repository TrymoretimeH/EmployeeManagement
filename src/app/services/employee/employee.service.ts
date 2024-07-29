import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';
import { Employee } from '../../pages/employees/employees.component';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  
  private empUrl = 'http://localhost:8094/api/employee';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  private provinceUrl = 'https://vapi.vnappmob.com'

  constructor() {
   }

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

  getAll(): Observable<Employee[]> {
    this.setHttpOptions();
    return this.http.get<Employee[]>(`${this.empUrl}/all`, this.httpOptions)
  }

  getProvince() {
    return this.http.get(`${this.provinceUrl}/api/province`);
  }

  getDistrict(proId: number) {
    return this.http.get(`${this.provinceUrl}/api/province/district/${proId}`);
  }

  getWard(disId: number) {
    return this.http.get(`${this.provinceUrl}/api/province/ward/${disId}`);
  }

  add(em: any): Observable<Employee> {
    this.setHttpOptions();
    return this.http.post<Employee>(`${this.empUrl}/add`, em , this.httpOptions);
  }

  update(em: any): Observable<Employee> {
    this.setHttpOptions();
    return this.http.put<Employee>(`${this.empUrl}/update`, em, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    this.setHttpOptions();
    return this.http.delete<any>(`${this.empUrl}/delete/${id}`, this.httpOptions);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenUtil } from '../../utils/token/token';

interface Salary {
  salaryId: number;
  baseSalary: number;
  allowance: number;
  deductions: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalarysService {
  private salUrl = 'http://localhost:8094/api/salary';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor() { }

  private setHttpOptions(): any {
    const token = tokenUtil.getToken();
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

  getAll(): Observable<Salary[]> {
    this.setHttpOptions();
    return this.http.get<Salary[]>(`${this.salUrl}/all`, this.httpOptions)
  }

  add(sal: any): Observable<Salary> {
    this.setHttpOptions();
    return this.http.post<Salary>(`${this.salUrl}/add`, sal , this.httpOptions);
  }

  update(sal: any): Observable<Salary> {
    this.setHttpOptions();
    return this.http.put<Salary>(`${this.salUrl}/update`, sal, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    this.setHttpOptions();
    return this.http.delete<any>(`${this.salUrl}/delete/${id}`, this.httpOptions);
  }
}

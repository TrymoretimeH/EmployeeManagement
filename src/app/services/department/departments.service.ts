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
  private empUrl = 'http://localhost:8094/api/department';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor() { }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.empUrl}/all`, this.httpOptions)
  }
}

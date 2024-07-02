import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  position: string;
  hireDate: string;
  departmentId: number;
  salaryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private empUrl = 'http://localhost:8094/api/employee';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor() {
   }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.empUrl}/all`, this.httpOptions)
  }
}

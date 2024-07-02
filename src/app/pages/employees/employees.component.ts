import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee/employee.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

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

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NzTableModule, CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  listOfEmployees: Employee[] = [];
  empService: EmployeeService = new EmployeeService();

  http = inject(HttpClient)

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.empService.getAll().subscribe(emps => this.listOfEmployees = emps)
  }
  
}

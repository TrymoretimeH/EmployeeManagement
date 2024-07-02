import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Observable } from 'rxjs';
import { EmployeeService } from '../../services/employee/employee.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormControl, FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BrowserModule } from '@angular/platform-browser';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { toNumber } from 'ng-zorro-antd/core/util';

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

interface Department {
  departmentId: number;
  departmentName: string;
}

interface Salary {
  salaryId: number;
  baseSalary: number;

}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    NzTableModule,
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzFlexModule,
    NzModalModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  listOfEmployees: Employee[] = [];
  empService: EmployeeService = new EmployeeService();

  isVisible = true;
  employeeForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    dateOfBirth: FormControl<string>;
    address: FormControl<string>;
    phoneNumber: FormControl<string>;
    email: FormControl<string>;
    position: FormControl<string>;
    hireDate: FormControl<string>;
    departmentId: FormControl<number>;
    salaryId: FormControl<number>;
  }>;
  listOfDepartments: Department[] = [
    {
      departmentId: 1,
      departmentName: 'IT',
    },
    {
      departmentId: 2,
      departmentName: 'HR',
    },
    {
      departmentId: 3,
      departmentName: 'Finance',
    },
  ];
  listOfSalarys: Salary[] = [
    {
      salaryId: 1,
      baseSalary: 1000,
    },
    {
      salaryId: 2,
      baseSalary: 2000,
    },
    {
      salaryId: 3,
      baseSalary: 3000,
    },
  ]

  constructor(private fb: NonNullableFormBuilder) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required]],
      position: ['', [Validators.required]],
      hireDate: ['', [Validators.required]],
      departmentId: [0, [Validators.required]],
      salaryId: [0, [Validators.required]],
    })
  }

  submitForm(): void {
    if (this.employeeForm.valid) {
      console.log('submit', this.employeeForm.value);
      
    } else {
      Object.values(this.employeeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    // Promise.resolve().then(() => this.employeeForm.controls.checkPassword.updateValueAndValidity());
  }


  handleChangeDep(value: any) {
    this.employeeForm.controls.departmentId.setValue(toNumber(value));
  }

  handleChangeSal(value: any) {
    this.employeeForm.controls.salaryId.setValue(toNumber(value));
  }



  showModal(data: Employee): void {
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  http = inject(HttpClient);

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.empService.getAll().subscribe((emps) => (this.listOfEmployees = emps));
  }
}

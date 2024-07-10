import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { EmployeeService } from '../../services/employee/employee.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BrowserModule } from '@angular/platform-browser';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { toNumber } from 'ng-zorro-antd/core/util';
import { DepartmentsService } from '../../services/department/departments.service';

export interface Employee {
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
    NzInputModule,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent {
  listOfEmployees: Employee[] = [];
  empService: EmployeeService = new EmployeeService();
  currentEmp: Employee | undefined = undefined;
  depService: DepartmentsService = new DepartmentsService()

  isVisible = false;
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
  ];

  autoTips: Record<string, Record<string, string>> = {
    default: {
      email: 'The input is not valid email!',
      min: 'One option must be selected',
      required: 'The input must be filled',
    },
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService
  ) {
    const { email, required, min } = Validators;

    this.employeeForm = this.fb.group({
      firstName: ['', [required]],
      lastName: ['', [required]],
      dateOfBirth: ['', [required]],
      address: ['', [required]],
      phoneNumber: ['', [required]],
      email: ['', [required, email]],
      position: ['', [required]],
      hireDate: ['', [required]],
      departmentId: [0, [required, min(1)]],
      salaryId: [0, [required, min(1)]],
    });
  }

  submitForm(): void {
    if (this.employeeForm.valid) {
      if (this.currentEmp != undefined) {
        this.empService
          .update({ id: this.currentEmp.id, ...this.employeeForm.value })
          .subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          });
      } else {
        this.empService.add(this.employeeForm.value).subscribe((res: any) => {
          if (res.isSuccess) {
            this.getAll();
          }
        });
      }
      this.isVisible = false;
    } else {
      Object.values(this.employeeForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleChangeDep(value: any) {
    this.employeeForm.controls.departmentId.setValue(toNumber(value));
  }
  handleChangeSal(value: any) {
    this.employeeForm.controls.salaryId.setValue(toNumber(value));
  }

  showModal(data: Employee | null = null): void {
    if (data != null) {
      this.currentEmp = data;
      this.employeeForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        phoneNumber: data.phoneNumber,
        email: data.email,
        position: data.position,
        hireDate: data.hireDate,
        departmentId: data.departmentId,
        salaryId: data.salaryId,
      });
    } else {
      this.currentEmp = undefined;
      this.employeeForm.reset();
      Object.values(this.employeeForm.controls).forEach((control) => {
        control.markAsPristine();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
    this.isVisible = true;
  }

  handleOk(): void {
    this.submitForm();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  isEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  showDeleteConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this employee?',
      nzContent: '<b style="color: red;">This action can not be restore</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.empService.delete(id).subscribe((res: any) => {
          console.log(res);
          if (res.isSuccess) {
            this.getAll();
          }
        }),
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.currentEmp = undefined;
        console.log('Cancel');
      },
    });
  }

  ngOnInit(): void {
    this.getAll();
    this.getDeps();
  }

  getAll(): void {
    this.empService.getAll().subscribe((emps) => (this.listOfEmployees = emps));
  }

  getDeps(): void {
    this.depService.getAll().subscribe((deps) => (this.listOfDepartments = deps))
  }
}

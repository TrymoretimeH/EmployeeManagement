import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DepartmentsService } from '../../services/department/departments.service';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { toNumber } from 'ng-zorro-antd/core/util';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../employees/employees.component';

export interface Department {
  departmentId: number;
  departmentName: string;
  employeeList: Employee[];
  description: string;
  managerId: number;
}

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    NzTableModule,
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzFlexModule,
    NzModalModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule,
    NzFormModule,
    FormsModule
  ],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  Department: Department[] = [];
  currentDep: Department | undefined = undefined;
  depService: DepartmentsService = new DepartmentsService();
  empService: EmployeeService = new EmployeeService();

  isVisible = false;

  depForm: FormGroup<{
    departmentName: FormControl<string>;
    description: FormControl<string>;
    managerId: FormControl<any>;
  }>;

  listOfManagers: Employee[] = [];

  autoTips: Record<string, Record<string, string>> = {
    default: {
      required: 'The input is required!',
    }
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService
  ) {
    const { required, min } = Validators;
    this.depForm = this.fb.group({
      departmentName: ['', [required]],
      description: ['', [required]],
      managerId: [0, [required, min(1)]],
    });
  }

  getNameForManager(managerId: number): string {
    const manager = this.listOfManagers.find((emp) => emp.id === managerId);
    if (manager?.id) {
      return manager.firstName + " " + manager.lastName;
    }
    return "";
  }

  submitForm(): void {
    if (this.depForm.valid) {
      if (this.currentDep != undefined) {
        this.depService
          .update({ departmentId: this.currentDep.departmentId, ...this.depForm.value })
          .subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          });
      } else {
        this.depService.add(this.depForm.value).subscribe((res: any) => {
          if (res.isSuccess) {
            this.getAll();
          }
        });
      }
      this.isVisible = false;
    } else {
      Object.values(this.depForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleChangeManager(value: any) {
    this.depForm.controls.managerId.setValue(toNumber(value));
  }

  showModal(data: Department | null = null): void {
    if (data != null) {
      this.currentDep = data;
      // this.listOfManagers = this.currentDep.employeeList
      this.depForm.setValue({
        departmentName: data.departmentName,
        description: data.description,
        managerId: data.managerId,
      });
    } else {
      this.currentDep = undefined;
      this.depForm.reset();
      Object.values(this.depForm.controls).forEach((control) => {
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

  showDeleteConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this department?',
      nzContent: '<b style="color: red;">This action can not be restore</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.depService.delete(id).subscribe((res: any) => {
          console.log(res);
          if (res.isSuccess) {
            this.getAll();
          }
        }),
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.currentDep = undefined;
        console.log('Cancel');
      },
    });
  }

  ngOnInit(): void {
    this.getAll();
    this.getManagers();
  }

  getAll(): void {
    this.depService.getAll().subscribe((deps) => (this.Department = deps));
  }

  getManagers(): void {
    this.empService.getAll().subscribe((emps) => {
      this.listOfManagers = emps;
    });
  }
}

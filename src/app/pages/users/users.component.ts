import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
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
import { AuthService, User } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

export const listOfRoles = [
  {
    label: 'Admin',
    value: 'ADMIN',
    checked: false
  },
  {
    label: 'User',
    value: 'USER',
    checked: false
  }
]

@Component({
  selector: 'app-users',
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
    FormsModule,
    NzCheckboxModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  Users: User[] = [];
  currentUser: User | undefined = undefined;
  listOfRoles = listOfRoles;

  isVisible = false;

  userForm: FormGroup<{
    id: FormControl<number>;
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    roles: FormControl<any>;
    employee: FormControl<any>;
  }>;

  listOfEmps: Employee[] = [];

  autoTips: Record<string, Record<string, string>> = {
    default: {
      required: 'The input is required!',
    }
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService,
    private userService: AuthService,
    private empService: EmployeeService,
    private storageService: StorageService
  ) {
    const { required, min } = Validators;
    this.userForm = this.fb.group({
      id: [0, []],
      name: ['', [required]],
      email: ['', [required]],
      password: ['', []],
      roles: [this.listOfRoles, []],
      employee: [null, []],
    });
  }

  getNameForEmp(employee: Employee): string {
    if (employee.id == 0) {
      return "null";
    }
    return employee.firstName + " " + employee.lastName;
  }

  submitForm(): void {
    if (this.userForm.valid) {
      if (this.currentUser != undefined) {
        this.userService
          .save(
            {
              ...this.currentUser,
              employee: this.userForm.controls.employee.value,
              roles: this.userForm.controls.roles.value.filter((role: any) => role.checked).map((role: any) => role.value).join(','),
            }
          )
          .subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          });
      } else {
        // this.userService.add(this.userForm.value).subscribe((res: any) => {
        //   if (res.isSuccess) {
        //     this.getAll();
        //   }
        // });
      }
      this.isVisible = false;
    } else {
      Object.values(this.userForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleChangeEmp(value: any) {
    this.userForm.controls.employee.setValue(value);
  }

  showModal(data: User | null = null): void {
    if (data != null) {
      this.currentUser = data;
      let emp = this.listOfEmps.find((emp) => emp.id == this.currentUser?.employee.id);
      if (emp) {
        this.currentUser.employee = emp;
      }
      
      
      // this.listOfEmps = this.currentUser.employeeList
      this.userForm.setValue(this.currentUser);
      // this.userForm.controls.employee.setValue(this.currentUser.employee);
      
      this.listOfRoles.map((role) => {
        if (this.currentUser?.roles.includes(role.value)) {
          role.checked = true;
        } else {
          role.checked = false;
        }
      })

      this.userForm.controls.roles.setValue(this.listOfRoles);

    } else {
      this.listOfRoles.map((role) => {
        role.checked = false;
      })
      this.currentUser = undefined;
      this.userForm.reset();
      Object.values(this.userForm.controls).forEach((control) => {
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
      nzTitle: 'Are you sure delete this User?',
      nzContent: '<b style="color: red;">This action can not be restore</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        if (this.storageService.getUser().id == id) {
          alert("Can not delete current logged in user!");
        } else {
          this.userService.delete(id).subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          })
        }
      },
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.currentUser = undefined;
        console.log('Cancel');
      },
    });
  }

  getIdFromCurrentLoggedUser(): number {
    return this.storageService.getUser().id;
  }

  ngOnInit(): void {
    this.getAll();
    this.getEmps();
  }

  getAll(): void {
    this.userService.getAll().subscribe((users) => (this.Users = users));
  }

  getEmps(): void {
    this.empService.getAll().subscribe((emps) => {
      this.listOfEmps = emps;
    });
  }
}

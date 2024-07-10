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
import { SalarysService } from '../../services/salary/salarys.service';
import { NzCardModule } from 'ng-zorro-antd/card';

interface Salary {
  salaryId: number;
  baseSalary: number;
  allowance: number;
  deductions: number;
}

@Component({
  selector: 'app-salarys',
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
    NzCardModule
  ],
  templateUrl: './salarys.component.html',
  styleUrl: './salarys.component.css',
})
export class SalarysComponent implements OnInit {
  Salary: Salary[] = [];
  currentSal: Salary | undefined = undefined;
  salService: SalarysService = new SalarysService();

  isVisible = false;

  salForm: FormGroup<{
    baseSalary: FormControl<number>;
    allowance: FormControl<number>;
    deductions: FormControl<number>;
  }>;

  autoTips: Record<string, Record<string, string>> = {
    default: {
      required: 'The input is required!',
    }
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService
  ) {
    const { required } = Validators;
    this.salForm = this.fb.group({
      baseSalary: [0, [required]],
      allowance: [0, [required]],
      deductions: [0, [required]],
    });
  }

  submitForm(): void {
    if (this.salForm.valid) {
      if (this.currentSal != undefined) {
        this.salService
          .update({ salaryId: this.currentSal.salaryId, ...this.salForm.value })
          .subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          });
      } else {
        this.salService.add(this.salForm.value).subscribe((res: any) => {
          if (res.isSuccess) {
            this.getAll();
          }
        });
      }
      this.isVisible = false;
    } else {
      Object.values(this.salForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  showModal(data: Salary | null = null): void {
    if (data != null) {
      this.currentSal = data;
      this.salForm.setValue({
        baseSalary: data.baseSalary,
        allowance: data.allowance,
        deductions: data.deductions,
      });
    } else {
      this.currentSal = undefined;
      this.salForm.reset();
      Object.values(this.salForm.controls).forEach((control) => {
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
      nzTitle: 'Are you sure delete this salary?',
      nzContent: '<b style="color: red;">This action can not be restore</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.salService.delete(id).subscribe((res: any) => {
          console.log(res);
          if (res.isSuccess) {
            this.getAll();
          }
        }),
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.currentSal = undefined;
        console.log('Cancel');
      },
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  getAll(): void {
    this.salService.getAll().subscribe((sals) => (this.Salary = sals));
  }
}

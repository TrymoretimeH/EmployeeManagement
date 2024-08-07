import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
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
import { Department } from '../departments/departments.component';
import { SalarysService } from '../../services/salary/salarys.service';
import { Province, ProvinceService } from '../../services/province/province.service';
import { District, DistrictService } from '../../services/district/district.service';
import { Ward, WardService } from '../../services/ward/ward.service';
import { lastValueFrom, Observable } from 'rxjs';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: any;
  province: Province;
  district: District;
  ward: Ward;
  phoneNumber: string;
  email: string;
  position: string;
  hireDate: string;
  department: Department;
  salaryId: number;
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
  providers: [EmployeeService, DepartmentsService],
})
export class EmployeesComponent {
  listOfEmployees: Employee[] = [];
  currentEmp: Employee | undefined = undefined;
  listOfProvince: any = [];

  listOfDistrict: any = [];
  listOfWard: any = [];

  isVisible = false;
  employeeForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    dateOfBirth: FormControl<string>;
    // address: FormControl<string>;
    // provinceCode: FormControl<string>;
    // districtCode: FormControl<string>;
    // wardCode: FormControl<string>;
    province: FormControl<any>;
    district: FormControl<any>;
    ward: FormControl<any>;
    phoneNumber: FormControl<string>;
    email: FormControl<string>;
    position: FormControl<string>;
    hireDate: FormControl<string>;
    department: FormControl<any>;
    salaryId: FormControl<number>;
  }>;
  listOfDepartments: Department[] = [];
  listOfSalarys: Salary[] = [];

  autoTips: Record<string, Record<string, string>> = {
    default: {
      email: 'The input is not valid email!',
      min: 'One option must be selected',
      required: 'The input must be filled',
    },
  };

  constructor(
    private fb: NonNullableFormBuilder,
    private modal: NzModalService,
    private empService: EmployeeService,
    private depService: DepartmentsService,
    private salService: SalarysService,
    private provinceService: ProvinceService,
    private districtService: DistrictService,
    private wardService: WardService
  ) {
    const { email, required, min } = Validators;

    this.employeeForm = this.fb.group({
      firstName: ['', [required]],
      lastName: ['', [required]],
      dateOfBirth: ['', [required]],
      // address: ['', [required]],
      province: ['', [required]],
      district: ['', [required]],
      ward: ['', [required]],
      phoneNumber: ['', [required]],
      email: ['', [required, email]],
      position: ['', [required]],
      hireDate: ['', [required]],
      department: [null, [required]],
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
    this.employeeForm.controls.department.setValue(value);
  }
  handleChangeSal(value: any) {
    this.employeeForm.controls.salaryId.setValue(toNumber(value));
  }

  handleChangeProvince(value: any) {
    console.log('CHANGED PROVINCE!' + value.name);
    // this.setAddress();
    if (this.listOfDistrict.length == 0 || this.listOfDistrict[0]?.provinceCode != value.code) {
      this.getDistrictByProvinceCode(value.code);
      this.employeeForm.controls.district.reset();
    }

  }

  handleChangeDistrict(value: any) {
    console.log('CHANGED DISTRICT!' + value?.name);

    if (this.listOfWard.length == 0 || this.listOfWard[0]?.districtCode != value.code) {
      this.getWardByDistrictCode(value.code);
      this.employeeForm.controls.ward.reset();
    }

  }

  handleChangeWard(value: any) {
    console.log('CHANGED WARD!' + value?.name);
  }

  setAddress() {
    console.log('SET ADDRESS!');
    let address = '';
    let ward = this.listOfWard.find(
      (ward: any) => ward.ward_id == this.employeeForm.value.ward.ward_id
    );
    let district = this.listOfDistrict.find(
      (dis: any) => dis.district_id == ward.district_id
    );
    let province = this.listOfProvince.find(
      (pro: any) => pro.province_id == district.province_id
    );
    // address = ward.ward_name + ', ' + district.district_name + ', ' + province.province_name;
    // this.employeeForm.controls.address.setValue(address)
  }

  async showModal(data: Employee | null = null) { 
    if (data != null) {
      this.currentEmp = data;

      let dep = this.listOfDepartments.find(dep => dep.departmentId === data.department?.departmentId);

      if (dep) {
        this.currentEmp.department = dep;
      }

      if (data?.province) {
        
        if (this.listOfDistrict.length === 0 || this.listOfDistrict[0]?.provinceCode != data.province.code) {
          await lastValueFrom(this.getDistrictByProvinceCode(data.province.code));
        }
        if (this.listOfWard.length === 0 || this.listOfWard[0]?.districtCode != data.district.code) {
          await lastValueFrom(this.getWardByDistrictCode(data.district.code));
        }
        let province = this.listOfProvince.find((pro: any) => pro.code === data.province.code);
        if (province) {
          this.currentEmp.province = province;
        }
        let district = this.listOfDistrict.find((dis: any) => dis.code === data.district.code);
        if (district) {
          this.currentEmp.district = district;
        }
        let ward = this.listOfWard.find((ward: any) => ward.code === data.ward.code);
        if (ward) {
          this.currentEmp.ward = ward;
        }
      } else {
      }

      this.employeeForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        // address: data.address,
        province: this.currentEmp.province,
        district: this.currentEmp.district,
        ward: this.currentEmp.ward,
        phoneNumber: data.phoneNumber,
        email: data.email,
        position: data.position,
        hireDate: data.hireDate,
        department: this.currentEmp.department,
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
    this.getSal();

    this.getProvince();
  }

  // getProvince(): void {
  //   this.empService.getProvince().subscribe((pros) => (this.listOfProvince = pros));
  // }

  // getDistrict(proId: number): void {
  //   this.empService.getDistrict(proId).subscribe((diss) => (this.listOfDistrict = diss));
  // }

  // getWard(disId: number): void {
  //   this.empService.getWard(disId).subscribe((wards) => (this.listOfWard = wards));
  // }

  getAll(): void {
    this.empService.getAll().subscribe(
      (emps) =>
        (this.listOfEmployees = emps.map((emp) => {
          if (emp.province) {
            return {
              ...emp,
              address:
                emp.ward?.nameEn +
                ', ' +
                emp.district?.nameEn +
                ', ' +
                emp.province?.nameEn,
            };
          }
          return {
            ...emp,
            address: '',
          }
        }))
    );
  }

  getDeps(): void {
    this.depService
      .getAll()
      .subscribe((deps) => (this.listOfDepartments = deps));
  }

  getSal(): void {
    this.salService.getAll().subscribe((sals) => (this.listOfSalarys = sals));
  }

  getProvince(): void {
    this.provinceService.getAll().subscribe((province) => (this.listOfProvince = province));
  }

  getDistrictByProvinceCode(provinceCode: string): Observable<unknown> {
    
    this.districtService.getByProvinceCode(provinceCode).subscribe((district) => {
      this.listOfDistrict = district;
    });
    return this.districtService.getByProvinceCode(provinceCode)
  }

  getWardByDistrictCode(districtCode: string): Observable<unknown> {
    this.wardService.getByDistrictCode(districtCode).subscribe((ward) => {
      this.listOfWard = ward;
    });
    return this.wardService.getByDistrictCode(districtCode);
  }
}

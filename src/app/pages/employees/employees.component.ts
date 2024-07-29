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
  listOfProvince: any = [
    {
      province_id: '92',
      province_name: 'Thành phố Cần Thơ',
      province_type: 'Thành phố Trung ương',
    },
    {
      province_id: '48',
      province_name: 'Thành phố Đà Nẵng',
      province_type: 'Thành phố Trung ương',
    },
    {
      province_id: '01',
      province_name: 'Thành phố Hà Nội',
      province_type: 'Thành phố Trung ương',
    },
    {
      province_id: '31',
      province_name: 'Thành phố Hải Phòng',
      province_type: 'Thành phố Trung ương',
    },
    {
      province_id: '79',
      province_name: 'Thành phố Hồ Chí Minh',
      province_type: 'Thành phố Trung ương',
    },
    {
      province_id: '89',
      province_name: 'Tỉnh An Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '77',
      province_name: 'Tỉnh Bà Rịa - Vũng Tàu',
      province_type: 'Tỉnh',
    },
    {
      province_id: '95',
      province_name: 'Tỉnh Bạc Liêu',
      province_type: 'Tỉnh',
    },
    {
      province_id: '24',
      province_name: 'Tỉnh Bắc Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '06',
      province_name: 'Tỉnh Bắc Kạn',
      province_type: 'Tỉnh',
    },
    {
      province_id: '27',
      province_name: 'Tỉnh Bắc Ninh',
      province_type: 'Tỉnh',
    },
    {
      province_id: '83',
      province_name: 'Tỉnh Bến Tre',
      province_type: 'Tỉnh',
    },
    {
      province_id: '74',
      province_name: 'Tỉnh Bình Dương',
      province_type: 'Tỉnh',
    },
    {
      province_id: '52',
      province_name: 'Tỉnh Bình Định',
      province_type: 'Tỉnh',
    },
    {
      province_id: '70',
      province_name: 'Tỉnh Bình Phước',
      province_type: 'Tỉnh',
    },
    {
      province_id: '60',
      province_name: 'Tỉnh Bình Thuận',
      province_type: 'Tỉnh',
    },
    {
      province_id: '96',
      province_name: 'Tỉnh Cà Mau',
      province_type: 'Tỉnh',
    },
    {
      province_id: '04',
      province_name: 'Tỉnh Cao Bằng',
      province_type: 'Tỉnh',
    },
    {
      province_id: '66',
      province_name: 'Tỉnh Đắk Lắk',
      province_type: 'Tỉnh',
    },
    {
      province_id: '67',
      province_name: 'Tỉnh Đắk Nông',
      province_type: 'Tỉnh',
    },
    {
      province_id: '11',
      province_name: 'Tỉnh Điện Biên',
      province_type: 'Tỉnh',
    },
    {
      province_id: '75',
      province_name: 'Tỉnh Đồng Nai',
      province_type: 'Tỉnh',
    },
    {
      province_id: '87',
      province_name: 'Tỉnh Đồng Tháp',
      province_type: 'Tỉnh',
    },
    {
      province_id: '64',
      province_name: 'Tỉnh Gia Lai',
      province_type: 'Tỉnh',
    },
    {
      province_id: '02',
      province_name: 'Tỉnh Hà Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '35',
      province_name: 'Tỉnh Hà Nam',
      province_type: 'Tỉnh',
    },
    {
      province_id: '42',
      province_name: 'Tỉnh Hà Tĩnh',
      province_type: 'Tỉnh',
    },
    {
      province_id: '30',
      province_name: 'Tỉnh Hải Dương',
      province_type: 'Tỉnh',
    },
    {
      province_id: '93',
      province_name: 'Tỉnh Hậu Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '17',
      province_name: 'Tỉnh Hoà Bình',
      province_type: 'Tỉnh',
    },
    {
      province_id: '33',
      province_name: 'Tỉnh Hưng Yên',
      province_type: 'Tỉnh',
    },
    {
      province_id: '56',
      province_name: 'Tỉnh Khánh Hòa',
      province_type: 'Tỉnh',
    },
    {
      province_id: '91',
      province_name: 'Tỉnh Kiên Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '62',
      province_name: 'Tỉnh Kon Tum',
      province_type: 'Tỉnh',
    },
    {
      province_id: '12',
      province_name: 'Tỉnh Lai Châu',
      province_type: 'Tỉnh',
    },
    {
      province_id: '20',
      province_name: 'Tỉnh Lạng Sơn',
      province_type: 'Tỉnh',
    },
    {
      province_id: '10',
      province_name: 'Tỉnh Lào Cai',
      province_type: 'Tỉnh',
    },
    {
      province_id: '68',
      province_name: 'Tỉnh Lâm Đồng',
      province_type: 'Tỉnh',
    },
    {
      province_id: '80',
      province_name: 'Tỉnh Long An',
      province_type: 'Tỉnh',
    },
    {
      province_id: '36',
      province_name: 'Tỉnh Nam Định',
      province_type: 'Tỉnh',
    },
    {
      province_id: '40',
      province_name: 'Tỉnh Nghệ An',
      province_type: 'Tỉnh',
    },
    {
      province_id: '37',
      province_name: 'Tỉnh Ninh Bình',
      province_type: 'Tỉnh',
    },
    {
      province_id: '58',
      province_name: 'Tỉnh Ninh Thuận',
      province_type: 'Tỉnh',
    },
    {
      province_id: '25',
      province_name: 'Tỉnh Phú Thọ',
      province_type: 'Tỉnh',
    },
    {
      province_id: '54',
      province_name: 'Tỉnh Phú Yên',
      province_type: 'Tỉnh',
    },
    {
      province_id: '44',
      province_name: 'Tỉnh Quảng Bình',
      province_type: 'Tỉnh',
    },
    {
      province_id: '49',
      province_name: 'Tỉnh Quảng Nam',
      province_type: 'Tỉnh',
    },
    {
      province_id: '51',
      province_name: 'Tỉnh Quảng Ngãi',
      province_type: 'Tỉnh',
    },
    {
      province_id: '22',
      province_name: 'Tỉnh Quảng Ninh',
      province_type: 'Tỉnh',
    },
    {
      province_id: '45',
      province_name: 'Tỉnh Quảng Trị',
      province_type: 'Tỉnh',
    },
    {
      province_id: '94',
      province_name: 'Tỉnh Sóc Trăng',
      province_type: 'Tỉnh',
    },
    {
      province_id: '14',
      province_name: 'Tỉnh Sơn La',
      province_type: 'Tỉnh',
    },
    {
      province_id: '72',
      province_name: 'Tỉnh Tây Ninh',
      province_type: 'Tỉnh',
    },
    {
      province_id: '34',
      province_name: 'Tỉnh Thái Bình',
      province_type: 'Tỉnh',
    },
    {
      province_id: '19',
      province_name: 'Tỉnh Thái Nguyên',
      province_type: 'Tỉnh',
    },
    {
      province_id: '38',
      province_name: 'Tỉnh Thanh Hóa',
      province_type: 'Tỉnh',
    },
    {
      province_id: '46',
      province_name: 'Tỉnh Thừa Thiên Huế',
      province_type: 'Tỉnh',
    },
    {
      province_id: '82',
      province_name: 'Tỉnh Tiền Giang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '84',
      province_name: 'Tỉnh Trà Vinh',
      province_type: 'Tỉnh',
    },
    {
      province_id: '08',
      province_name: 'Tỉnh Tuyên Quang',
      province_type: 'Tỉnh',
    },
    {
      province_id: '86',
      province_name: 'Tỉnh Vĩnh Long',
      province_type: 'Tỉnh',
    },
    {
      province_id: '26',
      province_name: 'Tỉnh Vĩnh Phúc',
      province_type: 'Tỉnh',
    },
    {
      province_id: '15',
      province_name: 'Tỉnh Yên Bái',
      province_type: 'Tỉnh',
    },
  ];

  listOfDistrict: any = [
    {
      district_id: '271',
      district_name: 'Huyện Ba Vì',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '277',
      district_name: 'Huyện Chương Mỹ',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '273',
      district_name: 'Huyện Đan Phượng',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '017',
      district_name: 'Huyện Đông Anh',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '018',
      district_name: 'Huyện Gia Lâm',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '274',
      district_name: 'Huyện Hoài Đức',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '250',
      district_name: 'Huyện Mê Linh',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '282',
      district_name: 'Huyện Mỹ Đức',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '280',
      district_name: 'Huyện Phú Xuyên',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '272',
      district_name: 'Huyện Phúc Thọ',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '275',
      district_name: 'Huyện Quốc Oai',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '016',
      district_name: 'Huyện Sóc Sơn',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '276',
      district_name: 'Huyện Thạch Thất',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '278',
      district_name: 'Huyện Thanh Oai',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '020',
      district_name: 'Huyện Thanh Trì',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '279',
      district_name: 'Huyện Thường Tín',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '281',
      district_name: 'Huyện Ứng Hòa',
      district_type: 'Huyện',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '001',
      district_name: 'Quận Ba Đình',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '021',
      district_name: 'Quận Bắc Từ Liêm',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '005',
      district_name: 'Quận Cầu Giấy',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '006',
      district_name: 'Quận Đống Đa',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '268',
      district_name: 'Quận Hà Đông',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '007',
      district_name: 'Quận Hai Bà Trưng',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '002',
      district_name: 'Quận Hoàn Kiếm',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '008',
      district_name: 'Quận Hoàng Mai',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '004',
      district_name: 'Quận Long Biên',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '019',
      district_name: 'Quận Nam Từ Liêm',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '003',
      district_name: 'Quận Tây Hồ',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '009',
      district_name: 'Quận Thanh Xuân',
      district_type: 'Quận',
      lat: null,
      lng: null,
      province_id: '01',
    },
    {
      district_id: '269',
      district_name: 'Thị xã Sơn Tây',
      district_type: 'Thị xã',
      lat: null,
      lng: null,
      province_id: '01',
    },
  ];
  listOfWard: any = [
    {
      district_id: '005',
      ward_id: '00166',
      ward_name: 'Phường Dịch Vọng',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00167',
      ward_name: 'Phường Dịch Vọng Hậu',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00163',
      ward_name: 'Phường Mai Dịch',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00157',
      ward_name: 'Phường Nghĩa Đô',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00160',
      ward_name: 'Phường Nghĩa Tân',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00169',
      ward_name: 'Phường Quan Hoa',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00175',
      ward_name: 'Phường Trung Hoà',
      ward_type: 'Phường',
    },
    {
      district_id: '005',
      ward_id: '00172',
      ward_name: 'Phường Yên Hoà',
      ward_type: 'Phường',
    },
  ];

  isVisible = false;
  employeeForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    dateOfBirth: FormControl<string>;
    address: FormControl<string>;
    province: FormControl<any>;
    district: FormControl<any>;
    ward: FormControl<any>;
    phoneNumber: FormControl<string>;
    email: FormControl<string>;
    position: FormControl<string>;
    hireDate: FormControl<string>;
    departmentId: FormControl<number>;
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
    private salService: SalarysService
  ) {
    const { email, required, min } = Validators;

    this.employeeForm = this.fb.group({
      firstName: ['', [required]],
      lastName: ['', [required]],
      dateOfBirth: ['', [required]],
      address: ['', [required]],
      province: [0, [required]],
      district: [0, [required]],
      ward: [0, [required]],
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

  handleChangeProvince(value: any) {
    console.log("CHANGED PROVINCE!" + value);
    this.setAddress();
  }

  handleChangeDistrict(value: any) {
    console.log("CHANGED DISTRICT!");
    console.log(value);
    
    this.employeeForm.controls.province.setValue(value.province_id);
  }

  handleChangeWard(value: any) {
    console.log("CHANGED WARD!");
    console.log(value);
    
    
    let district = this.listOfDistrict.find((dis: any) => dis.district_id == value.district_id);
    this.employeeForm.controls.district.setValue(district);
  }

  setAddress() {
    console.log("SET ADDRESS!");
    let address = '';
    let ward = this.listOfWard.find((ward: any) => ward.ward_id == this.employeeForm.value.ward.ward_id);
    let district = this.listOfDistrict.find((dis: any) => dis.district_id == ward.district_id);
    let province = this.listOfProvince.find((pro: any) => pro.province_id == district.province_id);
    address = ward.ward_name + ', ' + district.district_name + ', ' + province.province_name;
    this.employeeForm.controls.address.setValue(address)
  }



  showModal(data: Employee | null = null): void {
    if (data != null) {
      this.currentEmp = data;
      this.employeeForm.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        province: '',
        district: '',
        ward: '',
        phoneNumber: data.phoneNumber,
        email: data.email,
        position: data.position,
        hireDate: data.hireDate,
        departmentId: data.department.departmentId,
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

    // this.getProvince();
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
    this.empService.getAll().subscribe((emps) => (this.listOfEmployees = emps));
  }

  getDeps(): void {
    this.depService
      .getAll()
      .subscribe((deps) => (this.listOfDepartments = deps));
  }

  getSal(): void {
    this.salService.getAll().subscribe((sals) => (this.listOfSalarys = sals));
  }
}

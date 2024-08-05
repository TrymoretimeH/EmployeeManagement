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
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { toNumber } from 'ng-zorro-antd/core/util';
import { AttendanceService } from '../../services/attendance/attendance.service';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzImageModule } from 'ng-zorro-antd/image';
import { WebcamImage, WebcamInitError, WebcamModule, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { Employee } from '../employees/employees.component';
import { tokenUtil } from '../../utils/token/token';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-attendance',
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
    NzTimePickerModule,
    NzImageModule,
    WebcamModule
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {
  isAdmin = false;
  employeeDetails: Employee | null = null;
  data: Attendance[] = [];
  empData: any[] = [];
  currentAttendance: Attendance | undefined = undefined;
  isVisible = false;
  attendanceService: AttendanceService = new AttendanceService();
  fallback =
    'data:image/png;base64,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';
  webcamImage: WebcamImage | null = null;
  trigger: Subject<void> = new Subject<void>();
  isWebcamOpen = false;
  currentImage: any = null;

  attendanceForm: FormGroup<{
    employeeId: FormControl<number>;
    checkInTime: FormControl<Date>;
    checkOutTime: FormControl<Date>;
    attendanceDate: FormControl<Date>;
    image: FormControl<any>;
  }>;
  

  constructor(private modal: NzModalService,
    private fb: NonNullableFormBuilder,
    private empService: EmployeeService,
    private readonly sanitizer: DomSanitizer,
    private storageService: StorageService
  ) { 

    const { required, min } = Validators;

    this.attendanceForm = this.fb.group({
      employeeId: [0, [required, min(1)]],
      checkInTime: [new Date(), [required]],
      checkOutTime: [new Date(), [required]],
      attendanceDate: [new Date(), [required]],
      image: [null, [required]],
    });
  }

  showModal(data: Attendance | null = null): void {
    if (data != null) {
      this.currentAttendance = data;
      this.attendanceForm.controls.employeeId.setValue(data.employee.id);
      this.attendanceForm.controls.checkInTime.setValue(data.checkInTime);
      this.attendanceForm.controls.checkOutTime.setValue(data.checkOutTime);
      this.attendanceForm.controls.attendanceDate.setValue(data.attendanceDate);
      this.attendanceForm.controls.image.setValue(data.image);
      this.currentImage = data.image

      
    } else {
      this.currentAttendance = undefined;
      this.currentImage = null;
      if (this.employeeDetails != null) {
        if (this.employeeDetails?.id > 0) {
          this.attendanceForm.patchValue({
            employeeId: this.employeeDetails.id,
          });
        }  
      }
      
    }
    this.isVisible = true;
  }


  showDeleteConfirm(id: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this attendance?',
      nzContent: '<b style="color: red;">This action can not be restore</b>',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () =>
        this.attendanceService.delete(id).subscribe((res: any) => {
          if (res.isSuccess) {
            this.getAll();
          }
        }),
      nzCancelText: 'Cancel',
      nzOnCancel: () => {
        this.currentAttendance = undefined;
        console.log('Cancel');
      },
    });
  }

  submitForm(): void {
    console.log(this.attendanceForm.value);
    
    if (this.attendanceForm.valid) {
      const formData = new FormData();
      // const imageFile = this.attendanceForm.controls.image.value;
      
      Object.entries(this.attendanceForm.value).forEach(([key, value]) => {
        if (key === 'image') {
          if (this.currentImage instanceof File) {
            formData.append('image', this.currentImage);
          } else {
            console.log('Image is not a file');
          }
        }
        else {
          formData.append(key, `${value}`);
        }
      })
      
      

      if (this.currentAttendance != undefined) {
        if (this.storageService.getUser().roles.includes({ authority: "ADMIN" })) {
        formData.append('attendanceId', this.currentAttendance.attendanceId.toString());
        this.attendanceService
          .update(formData)
          .subscribe((res: any) => {
            if (res.isSuccess) {
              this.getAll();
            }
          });
        } else {
          alert("You are not authorized to update attendance!");
        }
      } else {
        this.attendanceService.add(formData).subscribe((res: any) => {
          if (res.isSuccess) {
            this.getAll();
          }
        });
      }
    } else {
      Object.values(this.attendanceForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleOk(): void {
    this.submitForm();
    this.currentAttendance = undefined;
    this.attendanceForm.reset()
    Object.values(this.attendanceForm.controls).forEach((control) => {
      control.markAsPristine();
      control.updateValueAndValidity({ onlySelf: true });
    });
    this.isVisible = false;
    this.currentImage = null;
    this.webcamImage = null;
    this.isWebcamOpen = false;
  }

  triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  handleCancel(): void {
    this.currentAttendance = undefined;
    this.attendanceForm.reset()
    Object.values(this.attendanceForm.controls).forEach((control) => {
      control.markAsPristine();
      control.updateValueAndValidity({ onlySelf: true });
    });
    this.isVisible = false;
    this.currentImage = null;
    this.webcamImage = null;
    this.isWebcamOpen = false;
  }

  handleChangeEmp(value: any) {
    this.attendanceForm.controls.employeeId.setValue(toNumber(value));
  }

  autoTips: Record<string, Record<string, string>> = {
    default: {
      min: 'One option must be selected',
      required: 'The input must be filled',
    },
  };

  handleChangeFile(event: any): void {
    const file = event.target.files[0];
    this.currentImage = file;
    // this.attendanceForm.controls.image.setValue(file);
    // this.updateImageSrc(URL.createObjectURL(file));
  }

  handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  handleCapture() {
    this.trigger.next();
  }

  handleImageOutput(webcamImg: WebcamImage) {
    this.webcamImage = webcamImg;
    if (webcamImg.imageAsDataUrl != null) {
      const blob = this.dataURLtoBlob(webcamImg.imageAsDataUrl);
      this.currentImage = new File([blob], "capture.jpg", { type: "image/jpeg" });
      this.attendanceForm.controls.image.setValue(blob);
      this.updateImageSrc(webcamImg.imageAsDataUrl)
    }
  }

  async handleImageConvertIfNotAsFile(imgUrl: string) {
    try {
      const file = await this.convertImageUrlToFile(imgUrl, "capture.jpg");
      console.log(file);
      return file;
      
    } catch (error) {
      console.error("Error converting image to file", error);
      return null;
    }
  }

  showWebcam() {
    this.isWebcamOpen = true;
  }

  updateImageSrc(link: string): void {
    document.getElementById('displayedImage')?.setAttribute('src', link);
  }

  // Add the following helper function at the end of the file
  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const matchResult = arr[0].match(/:(.*?);/);
    const mime = matchResult ? matchResult[1] : '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  ngOnInit() {

    this.getAll()

    this.empService.getAll().subscribe((emps) => {
      emps.map((emp) => {
        this.empData.push({
          employeeId: emp.id,
          employeeName: emp.firstName + " " + emp.lastName,
        });
      })
    });

    this.isAdmin = this.storageService.getUser().roles.includes({ authority: "ADMIN" });

    this.employeeDetails = this.storageService.getUser().employee;

  }

  getAll(): void {
    this.attendanceService.getAll().subscribe((atds) => {
      this.data = atds
      .map((atd) => {
        if (atd.image == null) {
          return {
            ...atd,
            checkInTime: new Date(atd.checkInTime),
            checkOutTime: new Date(atd.checkOutTime),
            attendanceDate: new Date(atd.attendanceDate)
          }
        } else {
          let objectURL = 'data:image/png;base64,' + atd.image;
          return {
            ...atd, 
            image: this.sanitizer.bypassSecurityTrustUrl(objectURL),
            checkInTime: new Date(atd.checkInTime),
            checkOutTime: new Date(atd.checkOutTime),
            attendanceDate: new Date(atd.attendanceDate)
           }
        }
      })
    });
  }

  async convertImageUrlToFile(imageUrl: string, fileName: string): Promise<File> {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: blob.type });
  }
}

export interface Attendance {
  attendanceId: number;
  employee: Employee;
  checkInTime: Date;
  checkOutTime: Date;
  attendanceDate: Date;
  image: any;
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tokenUtil } from '../../utils/token/token';
import { Attendance } from '../../pages/attendance/attendance.component';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private atdUrl = 'http://localhost:8094/api/attendance';
  private http = inject(HttpClient);
  private httpOptions = {
    headers: new HttpHeaders({ 
      // 'Content-Type': 'multipart/form-data'
     })
  }
  constructor() { }

  private setHttpOptions(): any {
    const token = tokenUtil.getToken();
    if (token) {
      this.httpOptions = {
        headers: new HttpHeaders({
          // 'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // Use Bearer authentication scheme
        })
      }; 
    } else {
      this.httpOptions = {
        headers: new HttpHeaders({ 
          // 'Content-Type': 'multipart/form-data'
         })
      };
    }
  }

  getAll(): Observable<Attendance[]> {
    this.setHttpOptions();
    return this.http.get<Attendance[]>(`${this.atdUrl}/all`, this.httpOptions)
  }

  add(atd: any): Observable<Attendance> {
    this.setHttpOptions();
    return this.http.post<Attendance>(`${this.atdUrl}/add`, atd , this.httpOptions);
  }

  update(atd: any): Observable<Attendance> {
    this.setHttpOptions();
    return this.http.put<Attendance>(`${this.atdUrl}/update`, atd, this.httpOptions);
  }

  delete(id: number): Observable<any> {
    this.setHttpOptions();
    return this.http.delete<any>(`${this.atdUrl}/delete/${id}`, this.httpOptions);
  }
}

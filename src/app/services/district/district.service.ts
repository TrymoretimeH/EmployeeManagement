import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


const DISTRICT_API = 'http://localhost:8094/api/district';

export interface District {
  code: string,
  name: string,
  nameEn: string,
  fullName: string,
  fullNameEn: string,
  codeName: string,
  provinceCode: string,
  administrativeUnitId: number,
}

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(DISTRICT_API + '/all', { withCredentials: true });
  }

  getByProvinceCode(provinceCode: string): Observable<any> {
    return this.http.get(DISTRICT_API + '/all/' + provinceCode, { withCredentials: true });
  }

  getByCode(code: string): Observable<any> {
    return this.http.get(DISTRICT_API + '/' + code, { withCredentials: true });
  }
}

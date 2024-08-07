import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROVINCE_API = 'http://localhost:8094/api/province';

export interface Province {
  code: string,
  name: string,
  nameEn: string,
  fullName: string,
  fullNameEn: string,
  codeName: string,
  administrativeUnitId: number,
  administrativeRegionId: number
}

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(PROVINCE_API + '/all', { withCredentials: true });
  }

  getByCode(code: string): Observable<any> {
    return this.http.get(PROVINCE_API + '/' + code, { withCredentials: true });
  }
}

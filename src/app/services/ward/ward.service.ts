import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const WARD_API = 'http://localhost:8094/api/ward';

export interface Ward {
  code: string,
  name: string,
  nameEn: string,
  fullName: string,
  fullNameEn: string,
  codeName: string,
  districtCode: string,
  administrativeUnitId: number,
}

@Injectable({
  providedIn: 'root'
})
export class WardService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(WARD_API + '/all', { withCredentials: true });
  }

  getByDistrictCode(districtCode: string): Observable<any> {
    return this.http.get(WARD_API + '/all/' + districtCode, { withCredentials: true });
  }

  getByCode(code: string): Observable<any> {
    return this.http.get(WARD_API + '/' + code, { withCredentials: true });
  }
}

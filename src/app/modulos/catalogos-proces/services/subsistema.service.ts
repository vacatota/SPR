import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from "rxjs";
import { ConstantsService } from '../../../services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class SubsistemaService {

  public url = ConstantsService.SUBSISTEMA_URL;
  constructor(private http: HttpClient) { }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => { return data; }
    ));
  }
  update(formData: any): Observable<any> {
    let { idSprSubsistema } = formData;
    return this.http.patch(`${this.url}/${idSprSubsistema}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete: any): Observable<any> {
    dataDelete.delLog = 'S';
    return this.http.patch(`${this.url}/${dataDelete.idSprSubsistema}`, dataDelete).pipe(map(data => {
      return data;
    }));
  }
}

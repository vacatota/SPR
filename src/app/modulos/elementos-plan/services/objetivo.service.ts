import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ObjetivoService {

  private url = ConstantsService.OBJETIVOS_URL;
  constructor(private http: HttpClient) { }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }
  list(query = ''): Observable<any> {
    return this.http.get(`${this.url}${query}`).pipe(map(data => {
      return data;
    }));
  }
  update(formData: any): Observable<any> {
    let { idSprObjetivo } = formData;
    return this.http.patch(`${this.url}/${idSprObjetivo}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprObjetivo}`, dataDelete).pipe(map(data => {
      return data;
    }));

  }

  listCatEnfoque(): Observable<any> {
    return this.http.get(`${ConstantsService.ESPECIALES_UNO_URL}`);
  }

  listCatPerspectiva(): Observable<any> {
    return this.http.get(`${ConstantsService.ESPECIALES_UNO_URL}`);
  }
}

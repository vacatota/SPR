import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialUnoService {
  public url = ConstantsService.ESPECIALES_UNO_URL;
  constructor(private http: HttpClient) { }

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => { return data; }
    ));
  }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }

  update(formData: any): Observable<any> {
    let { idSprEspecialUno } = formData;
    return this.http.patch(`${this.url}/${idSprEspecialUno}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }

  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprEspecialUno}`, dataDelete).pipe(map(data => {
      return data;
    }));
  }

}

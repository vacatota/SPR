
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EspecialDosService {
  public url = ConstantsService.ESPECIALES_DOS_URL;
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
    let { idSprEspecialDos } = formData;
    return this.http.patch(`${this.url}/${idSprEspecialDos}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }

  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprEspecialDos}`, dataDelete).pipe(map(data => {
      return data;
    }));
  }

}

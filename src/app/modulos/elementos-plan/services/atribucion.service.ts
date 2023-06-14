import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtribucionService {
  private url = ConstantsService.ATRIBUCIONES_URL;
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
    let { idSprAtribucion } = formData;
    return this.http.patch(`${this.url}/${idSprAtribucion}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }

  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprAtribucion}`, dataDelete).pipe(map(data => {
      return data;
    }));

  }
}

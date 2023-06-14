import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccionService {
  public url = ConstantsService.ACCIONES_URL;
  constructor(private http: HttpClient) { }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }
  
  list(query: string = ''): Observable<any> {
    console.log('Estrategias ruta', `${this.url}${query}`);
    return this.http.get(`${this.url}${query}`).pipe(map(
     data => {return data;}
   ));
 }

  update(formData: any): Observable<any> {
    let { idSprAccion } = formData;
    return this.http.patch(`${this.url}/${idSprAccion}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprAccion}`, dataDelete)
  }


}

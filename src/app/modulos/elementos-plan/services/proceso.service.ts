import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  public url = ConstantsService.PROCESOS_URL;
constructor(private http:HttpClient) { }

  create(formData:any): Observable<any>{
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
    return data;
      }));
  }
  list(query = ''): Observable<any>{
    console.log('Ruta proceso: ', `${this.url}${query}` );
    return this.http.get(`${this.url}${query}`).pipe(map(data => {
      return data;
     }));
  }
  update(formData:any): Observable<any>{
    let {idSprProceso} = formData;
    return this.http.patch(`${this.url}/${idSprProceso}`,formData).pipe(map(
      data => {
        return data;
      }
    ));;
 }
  delete(dataDelete:any): Observable<any>{
    return this.http.patch(`${this.url}/${dataDelete.idSprProceso}`,dataDelete).pipe(map(data => {
      return data;
    }));
 }

}

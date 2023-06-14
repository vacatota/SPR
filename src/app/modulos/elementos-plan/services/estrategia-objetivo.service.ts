import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class EstrategiaObjetivoService {
  private url = ConstantsService.ESTRATEGIA_OBJETIVO_URL;
  constructor(private http:HttpClient) { }
  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }

  create(formData:any):Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }

  update(formData:any): Observable<any> {
    let {idSprEstrategiaObjetivo} = formData;
     return this.http.patch(`${this.url}/${idSprEstrategiaObjetivo}`,formData).pipe(map(
       data => {
         return data;
       }
     ));
   }

   delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprEstrategiaObjetivo}`,dataDelete ).pipe(map(data => {
      return data;
    })); }
}

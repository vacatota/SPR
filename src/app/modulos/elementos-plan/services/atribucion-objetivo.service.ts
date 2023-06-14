import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtribucionObjetivoService {

  public url = ConstantsService.ATRIBUCIONES_OBJETIVOS_URL;
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
   let {idSprAtribucionObjetivo} = formData;
    return this.http.patch(`${this.url}/${idSprAtribucionObjetivo}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
}


import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AniosObjetivosService {
  public url = ConstantsService.PLANES_INSTITUCIONALES_ANUALES_URL;
   constructor(private http:HttpClient) { }

  create(formData:any):Observable<any> {
      return this.http.post(`${this.url}/`, formData).pipe(map(data => {
        return data;
      }));
    }

  list(query =''): Observable<any> {
    return this.http.get(`${this.url}${query}`).pipe(map(
     data => {return data;}
   ));
 }

  
  update(formData:any):Observable<any> {
    let {idSprPlanInsAnio} = formData;
    return this.http.patch(`${this.url}/${idSprPlanInsAnio}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  
    delete(dataDelete:any): Observable<any>{
      let editaEstadoAnios={
        ...dataDelete,
        delLog:"S"
      } 
      return this.http.patch(`${this.url}/${dataDelete.idSprPlanInsAnio}`,editaEstadoAnios ) }


 }

 

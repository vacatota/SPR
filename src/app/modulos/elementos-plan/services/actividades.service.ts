import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConstantsService } from 'src/app/services/constants.service';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  private url = ConstantsService.ACTIVIDADES_URL;
  constructor(private http:HttpClient) { }

  delete(dataDelete:any): Observable<any>{
    let editaEstado={
      ...dataDelete,
      delLog:"S"
    } 
    return this.http.patch(`${this.url}/${dataDelete.idSprActividad}`,editaEstado ) }


statusChange(data:any): Observable<any>{
  let editaEstadoActividad={
    ...data,
    estado:"2"
  } 
  return this.http.patch(`${this.url}/${data.idSprActividad}`,editaEstadoActividad ) 
}


// statusChange(data:any): Observable<any>{
//   let editaEstadoActividad={
//     ...data,
//     estado:"2", 
//    delLog:"S"
//   } 
//   return this.http.patch(`${this.url}/${data.idSprActividad}`,editaEstadoActividad ) 
// }
  createActividadesPlanN5(formData:any){
      return this.http.post(`${this.url}/`, formData);
  }
  getDataActividadesPlanN5():Observable<any>{
     return this.http.get(`${this.url}/`);
     
  }

  list(query =''): Observable<any> {
    return this.http.get(`${this.url}${query}`).pipe(map(
     data => {return data;}
   ));
 }

  updateActividadesPlanN5(formData:any){
    let {idSprActividad} = formData;
    return this.http.patch(`${this.url}/${idSprActividad}`,formData);
 }
//   deleteActividadesPlanN5(id:number){
//     return this.http.delete(`${base_url}/${this.url}/${id}`);
//  }

}




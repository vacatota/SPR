import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AreaElementoService {
  public url = ConstantsService.AREA_ELEMENTOS_URL;


  constructor(private http:HttpClient) { }


list(query = ''): Observable <any>{
  return this.http.get(`${this.url}${query}`).pipe(map(data => {
   return data;
  }));
}

 create(formData:any):Observable<any> {
  return this.http.post(`${this.url}/`, formData).pipe(map(data => {
    return data;
  }));
}

update(formData:any){
  console.log("datasoos", formData)
      let {idSprAreaElemento} = formData;
      return this.http.patch(`${this.url}/${idSprAreaElemento}`,formData);
   }

   delete(dataDelete:any): Observable<any>{
    let editaEstadoElemento={
      ...dataDelete,
      delLog:"S"
    } 
    return this.http.patch(`${this.url}/${dataDelete.idSprAreaElemento}`,editaEstadoElemento ) }

}

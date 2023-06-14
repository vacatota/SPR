import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  
  public url = ConstantsService.AREAS_URL;

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


update(formData:any): Observable<any> {
  let {idSprArea} = formData;
   return this.http.patch(`${this.url}/${idSprArea}`,formData).pipe(map(
     data => {
       return data;
     }
   ));
 }


 
delete(dataDelete: any): Observable<any> {
  return this.http.patch(`${this.url}/${dataDelete.idSprArea}`, dataDelete).pipe(map(data => {
    return data;
  }));

}

getDataArea(id:number){
  return this.http.get(`${base_url}/${this.url}/${id}`);
}
}







import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';
import { environment } from 'src/environments/environment';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlanAccionService {
   public url2 = 'objetivo-n5';
   public url = ConstantsService.PLAN_ACCION_URL;
   constructor(private http:HttpClient) { }

  createPlanesAccion(formData:any):Observable<any> {
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
       return this.http.patch(`${this.url}/${formData.idSprPlanAccion}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprPlanAccion}`,dataDelete ) }
  
  getDataplanaccionn5(){
     return this.http.get(`${base_url}/${this.url}/`);
     //console.log(`${base_url}/${this.url}/`);
  }
  updateplanaccionn5(formData:any){
    let {idSprPlanAccion} = formData;
    return this.http.patch(`${base_url}/${this.url}/${idSprPlanAccion}`,formData);
 }
  deleteplanaccionn5(id:number){
    return this.http.delete(`${this.url}/${id}`);
 }
getDataObjetivoN5(){
return this.http.get(`${base_url}/${this.url2}/`);
}
}
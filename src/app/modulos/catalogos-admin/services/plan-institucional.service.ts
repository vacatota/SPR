
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class PlanInstitucionalService {
  private url = ConstantsService.PLANES_INSTITUCIONALES_URL;
  constructor(private http:HttpClient) { }

  create(formData:any): Observable<any> {
      return this.http.post(`${this.url}/`, formData).pipe(map(
      data => {return data;}
    ));
  }

  list(): Observable<any> {
     return this.http.get(`${this.url}/`).pipe(map(
      data => {return data;}
    ));
  }

  update(formData:any): Observable<any> {
       let {idSprPlanInstitucional} = formData;
    return this.http.patch(`${this.url}/${idSprPlanInstitucional}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprPlanInstitucional}`,dataDelete ) }
}

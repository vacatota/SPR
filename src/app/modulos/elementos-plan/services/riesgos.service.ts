
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RiesgosService {
  public url = ConstantsService.RIESGOS_URL;
  constructor(private http: HttpClient) { }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  } 

  list(query: string = ''): Observable<any> {
    
    return this.http.get(`${this.url}${query}`).pipe(map(
     data => {return data;}
   ));
 }
 

  update(formData: any): Observable<any> {
    let { idSprRiesgo } = formData;
    return this.http.patch(`${this.url}/${idSprRiesgo}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete: any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprRiesgo}`, dataDelete)
  }

  delete1(dataDelete:any): Observable<any>{
    let editaEstadoRiesgo={
      ...dataDelete,
      delLog:"S"
    } 
    return this.http.patch(`${this.url}/${dataDelete.idSprRiesgo}`,editaEstadoRiesgo ) }


  getDataPlanIns() {
    // return this.http.get(`${this.url}/`);
    return this.http.get(`${ConstantsService.PLANES_INSTITUCIONALES_URL}/`);
  }

  getDataEstrategiAlinea(id: number) {

  }
  getDataEstrategias(selectedOption: number) {


  }

}



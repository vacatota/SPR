import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable({
  providedIn: 'root'
})
export class EstrategiasService {
  private url = ConstantsService.ESTRATEGIAS_URL;
  constructor(private http:HttpClient) { }

  create(formData:any): Observable<any> {
      return this.http.post(`${this.url}/`, formData).pipe(map(
      data => {return data;}
    ));
  }

  list(query = ''): Observable<any> {
     return this.http.get(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }

  update(formData:any): Observable<any> {
       let {idSprEstrategia} = formData;
    return this.http.patch(`${this.url}/${idSprEstrategia}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprEstrategia}`,dataDelete ).pipe(map(data => {
      return data;
    })); }

    getDataObjetivo(){
      return this.http.get(`${ConstantsService.OBJETIVOS_URL}/`);
      }
  }



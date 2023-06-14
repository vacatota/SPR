import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';


@Injectable({
  providedIn: 'root'
  
})
export class CatComunService {
  private url = ConstantsService.COMUNES_URL;
  constructor(private http:HttpClient) { }

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }
  

  create(formData:any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }

  update(formData:any): Observable<any> {
    let {idSprComun} = formData;
    return this.http.patch(`${this.url}/${idSprComun}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprComun}`,dataDelete).pipe(map(data => {
      return data;
    }));
  }

}
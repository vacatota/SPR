import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private url = ConstantsService.AREAS_URL;
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
    let {idSprArea} = formData;
    return this.http.patch(`${this.url}/${idSprArea}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprArea}`,dataDelete).pipe(map(data => {
      return data;
    }));
  }

}

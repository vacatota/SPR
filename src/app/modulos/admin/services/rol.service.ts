import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ConstantsService } from 'src/app/services/constants.service';

const url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private url = ConstantsService.ROLES_URL;
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
       let {idSprRol} = formData;
    return this.http.patch(`${this.url}/${idSprRol}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprRol}`,dataDelete ) }
  }
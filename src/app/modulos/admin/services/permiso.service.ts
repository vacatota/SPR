import { ConstantsService } from './../../../services/constants.service';
import { environment } from './../../../../environments/environment';
import { HttpClient} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  public url = ConstantsService.PERMISO_URL;
  constructor(private http:HttpClient) { }

  create(formData:any):Observable<any> {
      return this.http.post(`${this.url}/`, formData).pipe(map(data => {return data;}
        ));
    }

  list(): Observable<any> {
     return this.http.get(`${this.url}/`).pipe(map(
        data => {return data;}
      ));;

  }
  update(formData:any): Observable<any>{
    let {idSprPermiso} = formData;
    return this.http.patch(`${this.url}/${idSprPermiso}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }

  delete(dataDelete:any): Observable<any>{
    return this.http.patch(`${this.url}/${dataDelete.idSprPermiso}`,dataDelete ) }
  }
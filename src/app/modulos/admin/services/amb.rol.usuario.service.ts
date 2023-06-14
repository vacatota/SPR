import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable, map, catchError, throwError } from 'rxjs';
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AmbRolUsuarioService {
  public url = ConstantsService.AMBIENTES_ROLES_USUARIOS_URL;
   constructor(private http:HttpClient) { }

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }
  create(formData:any):Observable<any> {
      return this.http.post(`${this.url}/`, formData);    
    }
 
  update(formData:any):Observable<any> {
    return this.http.patch(`${this.url}/${formData.idsprAmbRolUsuario}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  delete(dataDelete:any): Observable<any>{
    return this.http.patch(`${this.url}/${dataDelete.idSprAmbRolUsuario}`,dataDelete ) }


  }
 

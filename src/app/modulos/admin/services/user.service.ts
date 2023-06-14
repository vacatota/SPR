import { ConstantsService } from './../../../services/constants.service';
import { RolService } from './rol.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BYPASS_JWT_TOKEN } from './../../../helpers/jwt.interceptor';


//const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = ConstantsService.USUARIOS_URL;
  public url_sippne_persona1= ConstantsService.SIIPNE_USUARIOS_URL_1;
  public url_sippne_persona2= ConstantsService.SIIPNE_USUARIOS_URL_2;
  public urlUserAmbiente = 'rolambienteusuario';
  constructor(private http:HttpClient,
              private rolService:RolService
   ) { }
  
   getPersonaSiipne(cedula:any):Observable<any> {
     return this.http.get(`${this.url_sippne_persona1}${cedula}${this.url_sippne_persona2}`, {context: new HttpContext().set(BYPASS_JWT_TOKEN, true)}).pipe(map(
      data => {return data;}
    ));
  }
    

    create(formData:any):Observable<any> {  
          return this.http.post(`${this.url}`, formData).pipe(map(
            data => {return data;}
          ));
        }
        
     delete(dataDelete:any): Observable<any> {
      console.log(dataDelete)
        return this.http.patch(`${this.url}/${dataDelete.idSprUsuario}`,dataDelete).pipe(map(data => {
          return data;
        }));
      }

      list(query: string = ''): Observable<any> {
        return this.http.get<{}>(`${this.url}${query}`).pipe(map(
          data => {return data;}
        ));
      }
      


    getDataUsers():Observable<any> {
     return this.http.get(`${this.url}/`).pipe(map(
      data => {return data;}
    ));
  }

 






  createCatalogoSubisitema(formData:any):Observable<any> {
    return this.http.post(`${this.url}/`, formData);
}
  updateCatalogoSubistema(formData:any):Observable<any> {
    let {idSprSubsistema} = formData;
    return this.http.patch(`${this.url}/${idSprSubsistema}`,formData);
 }
  deleteCatalogoSubistema(id:number):Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
 }

 //####################################################################
 // Crear rol y ambiente a un usuario
 //####################################################################
 createRolAmbienteUser(formData:any):Observable<any> {
  return this.http.post(`${this.urlUserAmbiente}/`, formData);
 }
}

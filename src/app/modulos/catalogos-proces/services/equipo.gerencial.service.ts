import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { RolService } from '../../admin/services/rol.service';
import { Observable, map } from 'rxjs';
import { BYPASS_JWT_TOKEN } from 'src/app/helpers/jwt.interceptor';


@Injectable({
  providedIn: 'root'
})
export class EquipoGerencialService {
  private url = ConstantsService.EQUIPO_GERENCIAL_URL;

  public url_sippne_persona1= ConstantsService.SIIPNE_USUARIOS_URL_1;
  public url_sippne_persona2= ConstantsService.SIIPNE_USUARIOS_URL_2;
  public urlUserAmbiente = 'rolambienteusuario';

  constructor(
    private http:HttpClient,
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
  

  update(formData:any):Observable<any> {
    return this.http.patch(`${this.url}/${formData.idSprEquipoGerencial}`,formData).pipe(map(
   data => {
     return data;
   }
 ));
}

delete(dataDelete:any): Observable<any> {
console.log(dataDelete)
  return this.http.patch(`${this.url}/${dataDelete.idSprEquipoGerencial}`,dataDelete).pipe(map(data => {
    return data;
  }));
}

actualizaEquipo(formData: any): Observable<any> {
  //formData.delLog='S'
  formData.estado = 2;
  return this.http.patch(`${this.url}/${formData.idSprEquipoGerencial}`, formData).pipe(map(data => {
    return data;
  }));
}

list(query: string = ''): Observable<any> {
  return this.http.get<{}>(`${this.url}${query}`).pipe(map(
    data => {return data;}
  ));
}

getById(id:number){
return this.http.get(`${this.url}/${id}`).pipe(map(
  data => {return data;}
  ));
  }
  
  
  




getDataUsers():Observable<any> {
return this.http.get(`${this.url}/`).pipe(map(
data => {return data;}
));
}



}





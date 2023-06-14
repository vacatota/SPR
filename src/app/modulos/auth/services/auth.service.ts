import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { ConstantsService } from '../../../services/constants.service';
import { Auth } from './../../auth/models/auth.model';
import { Usuario } from 'src/app/models/usuario.model';
import { JsonPipe } from '@angular/common';

const base_url = environment.base_url;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = ConstantsService.LOGIN_USER_URL;
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>; 

  httpsOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
    })
  };

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(<Usuario | null>JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getUsuarioActual() : Usuario | null {
    return this.currentUserSubject.value;
  }

  validateTocken(): Observable<boolean> {
    const tocken = localStorage.getItem('tocken') || '';
    return this.http.get(`${base_url}/renew`, {
      headers: { 'x-tocken': tocken }
    }).pipe(tap((resp: any) => {

      /* TODO
      Renovar Tocken en el backend y guardar en localstorage
      */
      //localStorage.setItem('tocken', resp.tocken)
      //console.log("Response verificacion tocken",resp)
    }),
      map(resp => resp),//Retornará lo que el back responda | Clase de RX    
      catchError(error => of(false))// Atrapa el error y retorna un false
    );
  }

  // Login principal correo y usuario
  auth(formData: Auth) {
    let usuario = new Usuario();
    return this.http.post(`${this.url}/`, formData, this.httpsOptions)
      .pipe(map((data: any) => {
        console.log("DataLogin: ",data)
        usuario.token = data.access_token;
        usuario.idSprUsuario = data.user.usuario[0].idSprUsuario;
        usuario.idSprRol = data.user.usuario[0].idSprRol;
        usuario.idSprNivel = data.user.usuario[0].idSprNivel;
        usuario.idSprAmbiente = data.user.usuario[0].idSprAmbiente
        usuario.nombres = data.user.usuario[0].nombreUsuario;
        usuario.nombreUnidad = data.user.usuario[0].nombreUnidad;
        usuario.userAmbiente = data.user.usuario;

        this.saveLocalStorage(usuario);
        localStorage.setItem("currentUser", JSON.stringify(usuario));
        //localStorage.setItem("rolAmbiente", JSON.stringify(data.user.usuario));
        return data;
      })
      );
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null)
  }
  

  private saveLocalStorage(user: Usuario) {
    localStorage.setItem('tocken', user.token);
  }

}

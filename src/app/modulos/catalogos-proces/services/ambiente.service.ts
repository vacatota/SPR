import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpContext } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AmbienteService {

  private url = ConstantsService.AMBIENTES_URL;

  constructor(private http: HttpClient) { }

  create(formData: any): Observable<any> {
    return this.http.post(`${this.url}/`, formData).pipe(map(data => {
      return data;
    }));
  }

  /*list(): Observable<any> {
    // OJO verificar ruta
    return this.http.get(`${this.url}`).pipe(map(
      data => { return data; }
    ));
  }*/

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }

  update(formData: any): Observable<any> {
    let { idSprAmbiente } = formData;
    return this.http.patch(`${this.url}/${idSprAmbiente}`, formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
}

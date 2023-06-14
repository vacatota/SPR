import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/services/constants.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpContext } from "@angular/common/http";
import { BYPASS_JWT_TOKEN } from 'src/app/helpers/jwt.interceptor';

@Injectable({
  providedIn: 'root'
})
export class UnidadesSiipneService {

  constructor(private http: HttpClient) { }

  listChilds(parent_id: number): Observable<any> {
    return this.http.get(`${ConstantsService.SIIPNE_UNIDADES_DEPENDIENTES_URL}${parent_id}`, { context: new HttpContext().set(BYPASS_JWT_TOKEN, true) }).pipe(
      map((data: any[]) => {
        let resp = [];
        data.forEach(element => {
          resp.push({ label: element.descripcion, data: element.idDgpUnidad, children: [{}] })
        });
        return resp;
      })
    )
  }

  listParents(): Observable<any> {
    return this.http.get(`${ConstantsService.SIIPNE_UNIDADES_URL}`, { context: new HttpContext().set(BYPASS_JWT_TOKEN, true) }).pipe(
      map((data: any[]) => {
        let resp = [];
        data.forEach(element => {
          resp.push({ label: element.descripcion, data: element.idDgpUnidad })
        });
        return resp;
      })
    )
  }
}

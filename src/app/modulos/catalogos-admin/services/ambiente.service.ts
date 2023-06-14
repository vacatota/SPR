import { ConstantsService } from './../../../services/constants.service';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BYPASS_JWT_TOKEN } from './../../../helpers/jwt.interceptor';


@Injectable({
  providedIn: 'root'
})
export class AmbienteService {
  private url = ConstantsService.AMBIENTES_URL;
  private url_siipne_unidades = ConstantsService.SIIPNE_UNIDADES_URL
  private url_siipne_unidades_dependientes = ConstantsService.SIIPNE_UNIDADES_DEPENDIENTES_URL
  public url3 = 'cat-niveles';
  public url4 = 'cat-unidades';
  constructor(private http:HttpClient) { }

  create(formData:any):Observable<any> {
      return this.http.post(`${this.url}/`, formData).pipe(map(data => {
        return data;
      }));
    }

  /*list(): Observable<any> {
    // OJO verificar ruta
     return this.http.get(`${this.url}`).pipe(map(
      data => {return data;}
    ));
  }*/

  list(query: string = ''): Observable<any> {
    return this.http.get<{}>(`${this.url}${query}`).pipe(map(
      data => {return data;}
    ));
  }
  update(formData:any): Observable<any> {
    let {idSprAmbiente} = formData;
    return this.http.patch(`${this.url}/${idSprAmbiente}`,formData).pipe(map(
      data => {
        return data;
      }
    ));
  }
  deleteAmbiente(id:number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
 }

  createCatalogoAmbinete(formData: any) : Observable<any> {
    return this.http.post(`${this.url}/`, formData);
  }
  getDataCatalogoAmbiente(): Observable<any> {
    return this.http.get(`${this.url}/`);
    //console.log(`${this.url}/`);
  }

  updateCatalogoAmbiente(formData:any): Observable<any> {
    let {idSprAmbiente} = formData;
    return this.http.patch(`${this.url}/${idSprAmbiente}`,formData);
  }
  delete(dataDelete:any): Observable<any> {
    return this.http.patch(`${this.url}/${dataDelete.idSprAmbiente}`,dataDelete ) }
  
  getDataCatalogoSubistema() : Observable<any> {
    return this.http.get(`${ConstantsService.SUBSISTEMA_URL}/`);
  }
  getDataCatalogoComun() : Observable<any> {
    return this.http.get(`${ConstantsService.COMUNES_URL}`);
  }

  getDataCatalogoComunUnidad() : Observable<any> {
    return this.http.get(`${this.url4}/`);
  }
  getDataCatalogoComunUnidades(id: number) : Observable<any> {
    return this.http.delete(`${this.url3}/${id}`);
  }


  // Traer unidades adscritas SPR
  getDataUnidadesAdscritas(): Observable<any> {
    let urlUnidadesNiveles = ConstantsService.AMBIENTES_URL;
    return this.http.get(`${urlUnidadesNiveles}/`);
  }

  getPersonaSiipne(formData:any): Observable<any> {
    let url_sippne='http://localhost:1000/api/siipne-persona';
    let {cedula} = formData;
     return this.http.get(`${url_sippne}/${cedula}`);
  }
  
  //################################################
  // Obtiene unidades padres del Siipne
  //################################################
  getUnidadesSippne(): Observable<any> {
   console.log('Unidades siipne: ', this.url_siipne_unidades );
    return this.http.get(`${this.url_siipne_unidades}`, {context: new HttpContext().set(BYPASS_JWT_TOKEN, true)}).pipe(map(data => {
      return data;
    }));
  }
  
   getDataUnidadDependienteSiipne(idCatalogoPadre: number) : Observable<any> {    
    return this.http.get(`${this.url_siipne_unidades_dependientes}${idCatalogoPadre}`, {context: new HttpContext().set(BYPASS_JWT_TOKEN, true)}).pipe(map(data => {
      return data;
    }));
  }
  


}
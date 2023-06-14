import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class ConstantsCatalogosIdService {

  constructor() { }

  public static get ID_COMUNES_TITULAR(): number { return 100; }
  public static get ID_COMUNES_ENFOQUE(): number { return 108; }
  public static get ID_COMUNES_PERSPECTIVA(): number { return 101; }
  public static get ID_COMUNES_NIVEL_1(): number { return 213; }

}
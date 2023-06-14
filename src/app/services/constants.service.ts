import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ConstantsService {

  constructor() { }

  protected static get base_url(): string {
    return  environment.base_url;
  }

  //public static get SIIPNE_UNIDADES_DEPENDIENTES_URL(): string { return 'https://siipne3wv2.policia.gob.ec:444/v1/unidades.php?usuarioWS=spr&claveWS=spr2023&idParent='; }
  public static get SIIPNE_UNIDADES_URL(): string { return 'https://192.168.80.71:444/v1/unidades.php?usuarioWS=spr&claveWS=spr2023'; }
  public static get SIIPNE_USUARIOS_URL_1(): string { return 'https://192.168.80.71:444/v1/usuarios.php?dni='; }
  public static get SIIPNE_USUARIOS_URL_2(): string { return '&usuarioWS=spr&claveWS=spr2023'; }
  public static get SIIPNE_UNIDADES_DEPENDIENTES_URL(): string { return 'https://192.168.80.71:444/v1/unidades.php?usuarioWS=spr&claveWS=spr2023&idParent='; }
  public static get SIIPNE_UNIDADES_ARBOL_URL(): string { return 'https://192.168.80.71:444/v1/unidadesTree.php?usuarioWS=spr&claveWS=spr2023'; }

  public static get LOGIN_USER_URL(): string { return this.base_url + '/v1/auth/ingreso'; }
  public static get ACCIONES_URL(): string { return this.base_url + '/v1/acciones'; }
  public static get ACTIVIDADES_URL(): string { return this.base_url + '/v1/actividades'; }
  public static get AMBIENTES_PARTICIPANTES_URL(): string { return this.base_url + '/v1/ambientes-participantes'; }
  public static get AMBIENTES_URL(): string { return this.base_url + '/v1/ambientes'; }
  public static get AMBIENTES_ROLES_USUARIOS_URL(): string { return this.base_url + '/v1/ambientes-roles-usuarios'; }
  public static get AMBIENTES_USUARIOS_URL(): string { return this.base_url + '/v1/ambientes-usuarios'; }
  public static get ANIOS_URL(): string { return this.base_url + '/v1/anios'; }
  public static get APLICACIONES_URL(): string { return this.base_url + '/v1/aplicaciones'; }
  public static get APP_PERMISOS_URL(): string { return this.base_url + '/v1/app-permisos'; }
  public static get AREAS_URL(): string { return this.base_url + '/v1/areas'; }
  public static get ATRIBUCIONES_OBJETIVOS_URL(): string { return this.base_url + '/v1/atribuciones-objetivos'; }
  public static get ATRIBUCIONES_URL(): string { return this.base_url + '/v1/atribuciones'; }
  public static get COMUNES_URL(): string { return this.base_url + '/v1/comunes'; }
  public static get CONFIG_INDICADORES_URL(): string { return this.base_url + '/v1/config-indicadores'; }
  public static get EQUIPOS_PERSONALES_URL(): string { return this.base_url + '/v1/equipos-personales'; }
  public static get ESPECIALES_DOS_URL(): string { return this.base_url + '/v1/especiales-dos'; }
  public static get ESPECIALES_UNO_URL(): string { return this.base_url + '/v1/especiales-uno'; }
  public static get ESTRATEGIAS_URL(): string { return this.base_url + '/v1/estrategias'; }
  public static get ESTRATEGIA_OBJETIVO_URL(): string { return this.base_url + '/v1/estrategias-objetivos'; }
  public static get HITOS_URL(): string { return this.base_url + '/v1/hitos'; }
  public static get INDICADORES_URL(): string { return this.base_url + '/v1/indicadores'; }
  public static get LINEAS_ACCION_URL(): string { return this.base_url + '/v1/lineas-accion'; }
  public static get OBJETIVOS_URL(): string { return this.base_url + '/v1/objetivos'; }
  public static get PERMISO_URL(): string { return this.base_url + '/v1/permisos'; }
  public static get PLAN_ACCION_URL(): string { return this.base_url + '/v1/planes-accion'; }
  public static get DESEMPENIOS_PROCESO_URL(): string { return this.base_url + '/v1/desempenios-proceso'; }
  public static get PLANES_ANUALES_URL(): string { return this.base_url + '/v1/planes-anuales'; }
  public static get PLANES_INSTITUCIONALES_ANUALES_URL(): string { return this.base_url + '/v1/planes-institucionales-anuales'; }
  public static get PLANES_INSTITUCIONALES_URL(): string { return this.base_url +'/v1/planes-institucionales'; }
  public static get PROCESOS_URL(): string { return this.base_url + '/v1/procesos'; }
  public static get PROYECTOS_URL(): string { return this.base_url + '/v1/proyectos'; }
  public static get RIESGOS_URL(): string { return this.base_url + '/v1/riesgos'; }
  public static get ROLES_URL(): string { return this.base_url + '/v1/roles'; }
  public static get ROLES_USUARIOS_URL(): string { return this.base_url + '/v1/roles-usuarios'; }
  public static get SUBSISTEMA_URL(): string { return this.base_url + '/v1/subsistemas'; }
  public static get UMBRALES_URL(): string { return this.base_url + '/v1/umbrales'; }
  public static get USUARIOS_URL(): string { return this.base_url + '/v1/usuarios'; }
  public static get EQUIPO_GERENCIAL_URL(): string { return this.base_url + '/v1/equipos-gerenciales'; }
  public static get AREA_ELEMENTOS_URL(): string { return this.base_url + '/v1/areas-elementos'; }
  public static get PARTICIPANTE_ELEMENTOS_URL(): string { return this.base_url + '/v1/participantes-elementos'; }

}

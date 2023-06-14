export class Riesgos{
  constructor(
    // ? opcional
    public idSprRiesgo:number,
    public idSprObjetivo:number,
    public idSprLineaAccion:number,
    public idSprPlanAccion:number,
    public idSprProyecto:number,
    public idSprEstructuraEdr: number,
    public idSprEquipoGerencial: number,
    public idSprParticipanteElemento: number,
    public nombre: string,
    public descripcion: string,
    public fechaIdentificacion: Date,
    public probabilidad: number,
    public impacto: number,
    public calificacion: number,
    public costoPotencial: number,
    public fechaOcurrencia: Date,
    public fechaCierre: Date,
    public estado: number
  ){
  }
}
export interface Proceso{


  idSprProceso:number,
  idSprTipoCliente: number,
  idSprAmbiente: number,
  idSprTipoProceso: number,
  idSprMejoras: number,
  idSprEstrategia: number,
  idSprObjetivo: number,
  idSprArea: number,
  idSprAreaProceso:number,
  nombre: string,
  descripcion: string,
  producto: string,
  fechaInicio: Date,
  fechaFin: Date,
  tiempoCiclo:number,
  numeroPersonaAsignada: number,
  procesoDocumentado: number,
  procesoCertificado: number,
  fechaCertificacion: number,
  estado: number,

}

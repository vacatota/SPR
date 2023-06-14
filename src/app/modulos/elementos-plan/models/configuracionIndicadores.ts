export interface ConfiguracionIndicadores{


  idSprConfigIndicador:number,
  idSprIndicador: number,
  idSprAmbiente: number,
  idSprUnidadMedida: number,
  idSprUmbral: number,
  idSprComportamiento: number,
  idSprExpresion: number,
  idSprFrecuencia: number,
  idSprJerarquia:number,
  idSprTipoIndicador:number,
  fechaInicio: Date,
  lineaBase: number,
  informacionFormula:string,
  metaPeriodo: number,
  numerador: number,
  denominador: number,
  respaldoPdf: string,
  comentario: string,
  mayorIgual: number,
  rangoIntermedio: number,
  menorIgual: number,
  estado: number,

}

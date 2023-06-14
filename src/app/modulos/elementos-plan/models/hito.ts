export interface Hito{
       idSprHito?:number,
       idSprProyecto?:number,
       idSprCategoriaHitos?: number,
       idSprEtapaProyecto?: number,
       nombre?: string,
       categoria?: string,
       maximoHito?: number,
       pesoHito?: number,
       fechaComprometida?: Date,
       fechaEstimada?: Date,
       fechaReal?: Date,
       cumplimientoHito?: number,
       avance?: number,
       estado?: number,
       nameProyecto?:string,
}
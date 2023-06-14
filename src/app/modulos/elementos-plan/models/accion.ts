export class Accion{
    constructor(
      // ? opcional
      public idSprAccion:number,
      public idSprTipoAccion: number,
      public descripcion: string,
      public fechaComprometida: Date,
      public fechaCompletada: Date,
      public estado: number,
    ){
    }
}
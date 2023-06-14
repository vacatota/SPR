export class Objetivos {
    constructor(
        // ? opcional
        public idSprObjetivo:number,
        public idSprEnfoque:number,
        public idSprPerspectiva: number,
        public idSprAtribucion: number,
        public idSprAmbiente:number,
        public idSprEstrategia:number,
        public idSprAtribucionObjetivo:number,
        public idSprEstrategiaObjetivo:number,
        public estrat:number,
        public nombre: string,
        public descripcion: string,
        public fechaInicio: Date,
        public fechaFin: Date,
        public estado: number,
      
      ){
      }
}
export class Usuario {
    token: string;
    idSprUsuario: number;
    idSprRol: number;
    idSprNivel: number;
    idSprAmbiente: number;
    nombres: string;
    userAmbiente: string;
    nombreUnidad: string;


    constructor() {
        this.token = '';
        this.idSprUsuario = 0;
        this.idSprRol = 0;
        this.idSprNivel = 0;
        this.idSprAmbiente = 0;
        this.nombres = '',
        this.userAmbiente = ''
        this.nombreUnidad = ''
    }
}

export class Grupo {
    public id?: string;
    public nombre: string;
    public descripcion: string;
    public admin: Array<string>;
    public publico: boolean;
    public imagen: string;
    public integrantes?: Array<string>;

    constructor(nombre: string, descripcion: string, admin: Array<string>, publico: boolean,
         imagen: string, integrantes?: Array<string>) {
        this.nombre = nombre,
        this.descripcion = descripcion,
        this.admin = admin,
        this.publico = publico,
        this.imagen = imagen,
        this.integrantes = integrantes
    }
}




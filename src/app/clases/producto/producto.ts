export class Producto {
    public id:string;
    public duenio: string;
    public nombre: string;
    public descripcion: string;
    public zona: string;
    public rutaDeFoto: string;

    constructor(id: string,duenio: string, nombre: string, descripcion: string, zona: string, foto: string) {
        this.id = id;
        this.nombre = nombre; 
        this.duenio = duenio;
        this.descripcion = descripcion;
        this.zona = zona;
        this.rutaDeFoto = foto;
    }
}

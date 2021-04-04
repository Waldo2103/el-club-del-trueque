export class Producto {
    public id:string;
    public owner: string;
    public nombre: string;
    public descripcion: string;
    public etiquetas: string;
    public imagen: string;

    constructor(id: string,owner: string, nombre: string, descripcion: string, etiquetas: string, foto: string) {
        this.id = id;
        this.nombre = nombre; 
        this.owner = owner;
        this.descripcion = descripcion;
        this.etiquetas = etiquetas;
        this.imagen = foto;
    }
}

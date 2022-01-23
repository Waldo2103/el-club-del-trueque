export class Producto {
    public id?:string;
    public owner: string;
    public nombre: string;
    public descripcion: string;
    public etiquetas: string;
    public imagen: string;
    public zona: string;
    public album?: string;
    public apodo: string;
    public estado?: boolean;

    constructor(id: string, owner: string, nombre: string, descripcion: string, etiquetas: string, foto: string, zona:string, album:string, apodo: string, estado: boolean) {
        this.id = id;
        this.nombre = nombre; 
        this.owner = owner;
        this.descripcion = descripcion;
        this.etiquetas = etiquetas;
        this.imagen = foto;
        this.zona = zona;
        this.album = album;
        this.apodo = apodo;
        this.estado = estado;
    }
}

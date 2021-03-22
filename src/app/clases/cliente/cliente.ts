export class Cliente {
    public correo: string;
    public nombre: string;
    public apellido: string;
    public foto: string;

    constructor() {
        this.correo = '';
        this.nombre = '';
        this.apellido = '';
        this.foto = '';
    }
}

export interface ClienteKey {
    key: string;
    apellido: string;
    correo: string;
    foto: string;
    nombre: string;
}

export interface ClienteAConfirmarKey {
    key: string;
    apellido: string;
    correo: string;
    foto: string;
    nombre: string;
    clave: string;
}

export class ClienteAConfirmar {
    public correo: string;
    public nombre: string;
    public apellido: string;
    public foto: string;
    public clave: string;

    constructor() {
        this.correo = '';
        this.nombre = '';
        this.apellido = '';
        this.foto = '';
        this.clave = '';
    }
}

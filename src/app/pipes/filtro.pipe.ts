import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../clases/producto/producto';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(productos: Producto[], texto: string): Producto[] {
    
    if (texto.length === 0) { return productos;}
    texto = texto.toLocaleLowerCase();

    return productos.filter( producto => {
      return producto.nombre.toLocaleLowerCase().includes(texto)
          || producto.zona.toLocaleLowerCase().includes(texto);
    });

  }

}

import type { Estados } from "./estados"
import type { Producto } from "./productos"

export interface Registro {
    id:number
    fecha:string
    cantidad:number


    estado_id:number
    estados: Estados

    producto_id:number
    productos:Producto

    create_at:string
}
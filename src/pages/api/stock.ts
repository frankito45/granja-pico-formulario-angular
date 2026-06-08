import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json()

    const { error } = await supabase.from('movimientos_stock')
    .insert({
      local_id: data.local_id,
      estado_id: data.estado_id,
      producto_id: data.producto_id,
      cantidad: data.cantidad
    })

     if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    success: true
  });

  } catch (error) {
    console.error(error)

    return Response.json(
      {
        success: false,
        error: "Error procesando datos"
      },
      {
        status: 500
      }
    );
  }
};


// src/pages/api/stock.ts


export const GET: APIRoute = async ({ url }) => {
  const fecha = url.searchParams.get("fecha");
  const local = url.searchParams.get("local");
  const categoria = url.searchParams.get("categoria");

  if (!fecha || !local || !categoria) {
    return Response.json(
      { error: "Faltan parámetros" },
      { status: 400 }
    );
  }

const desde = `${fecha}T00:00:00-03:00`;
const hasta = `${fecha}T23:59:59-03:00`;

  const { data, error } = await supabase
    .from("movimientos_stock")
    .select(`
      cantidad,
      productos!inner(
        id,
        nombre,
        categoria
      ),
      estados!inner(
        nombre
      )
    `)
    .eq("local_id", Number(local))
    .eq("productos.categoria", categoria)
    .gte("fecha", desde)
    .lte("fecha", hasta);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const { data: mermas } = await supabase
    .from("mermas")
    .select("producto_id, merma");

  const mapaMermas = new Map<number, number>();

  mermas?.forEach((m) => {
    mapaMermas.set(
      Number(m.producto_id),
      Number(m.merma)
    );
  });

  const resumen: Record<string, any> = {};

  for (const mov of data) {
    const producto = mov.productos.nombre;
    const producto_id = mov.productos.id;
    const estado = mov.estados.nombre;
    const cantidad = Number(mov.cantidad);

if (!resumen[producto]) {
  resumen[producto] = {
    producto,
    producto_id,
    categoria: mov.productos.categoria,
    merma: mapaMermas.get(producto_id) ?? 0,
    inicio: 0,
    ingreso: 0,
    produccion: 0,
    envio: 0,
    devolucion: 0,
    final: 0,
    ventas: 0,
  };
}

    if (estado in resumen[producto]) {
      resumen[producto][estado] += cantidad;
    }
  }

Object.values(resumen).forEach((item: any) => {

  const factor = 1 - item.merma / 100;

  item.ingreso_mostrado =
    Number((item.ingreso * factor).toFixed(2));

  item.produccion_mostrada =
    Number((item.produccion * factor).toFixed(2));

  item.ventas =
    item.inicio +
    item.ingreso_mostrado +
    item.produccion_mostrada -
    item.envio -
    item.devolucion -
    item.final;

});

  return Response.json(Object.values(resumen));
};
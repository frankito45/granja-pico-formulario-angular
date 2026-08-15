import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const prerender = false;

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
      id,
      fecha,
      cantidad,
      estado_id,
      productos!inner(
        id,
        nombre,
        categoria
      ),
      estados!inner(
        nombre
      ),
      create_at
    `)
    .eq("local_id", Number(local))
    .eq("productos.categoria", categoria)
    .gte("fecha", desde)
    .lte("fecha", hasta)
    .order("id",{ascending:false});

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data)

}


export const PATCH: APIRoute = async ({request}) => {
  const { id, cantidad, estado_id } = await request.json();
  console.log(cantidad)
  console.log(estado_id)

  const { error } = await supabase
    .from("movimientos_stock")
    .update({
      cantidad,
      estado_id,
    })
    .eq("id", id);

if (error) {
  return new Response(
    JSON.stringify(error),
    { status: 500 }
  );
}

  return new Response(
    JSON.stringify({ ok: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
}

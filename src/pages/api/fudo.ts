
import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {

    console.log("RECIBIDO:", url.toString());

    const fecha = url.searchParams.get("fecha");
    const local = url.searchParams.get("local");

    console.log({
        fecha,
        local
    });


    return new Response(
        JSON.stringify({
            fecha,
            local
        }),
        {
            headers:{
                "Content-Type":"application/json"
            }
        }
    );

};


export const PUT: APIRoute = async ({ request }) => {

  const body = await request.json();

  const { error } = await supabase
    .from("fudo")
    .upsert(
      {
        fecha: body.fecha,
        local: Number(body.local),
        producto: Number(body.producto),
        valor: Number(body.valor)
      },
      {
        onConflict: "fecha,local,producto"
      }
    );

  if (error) {
    return new Response(
      JSON.stringify(error),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200 }
  );
};
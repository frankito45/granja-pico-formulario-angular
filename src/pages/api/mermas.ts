import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";


export const prerender = false;

export const PATCH: APIRoute = async ({request})=>{
    try{

        const {id,merma } = await request.json()

        const {data, error} = await supabase
        .from('mermas')
        .update({
            merma
        })
        .eq('id',id)
        .select()
        .single();

        if (error) {
             return Response.json(
            { error: error.message },
            { status: 500 }
        )
        }
         return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    }catch(err){
         return new Response(
      JSON.stringify({ error: "Datos inválidos" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

} 

export const GET: APIRoute = async () => {
    const {data , error} = await supabase
    .from('mermas')
    .select('* ,productos(nombre)')

    if (error) {
        return Response.json(
            { error: error.message },
            { status: 500 }
        )
        
    }

    return new Response(JSON.stringify(data),{
        status:200,
        headers: {
            'Content-Type': 'application/json',
        }
    }
        )

}


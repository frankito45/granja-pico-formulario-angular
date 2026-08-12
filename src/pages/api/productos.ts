import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";



export const prerender = false

export const GET:APIRoute = async () => {
    const {data, error} = await supabase
    .from('productos')
    .select('*')
    
    if(error){
        return Response.json(
            {
                error: error.message
            },
            {
                status:504
            }
        )
    }
    
    return Response.json(data)
}
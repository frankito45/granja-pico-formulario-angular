
export async function getDataDay(
  fecha: string,
  local: string,
  categoria: string
) {
  const response = await fetch(
    `/api/historial?fecha=${fecha}&local=${local}&categoria=${categoria}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener los datos");
  }
  
  const result = await response.json();

  return result;
}


export async function actualizarMovimientos(id:number ,cantidad:number, estado:number) {
 const response = await fetch("/api/historial", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
  },

  body: JSON.stringify({
    id: id,
    cantidad: Number(cantidad),
    estado_id: Number(estado),
  }),
 });
   if (!response.ok) {
    throw new Error("No se pudo actualizar");
  }

  return response.json();

}


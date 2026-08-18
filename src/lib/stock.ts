export async function getResumen(fecha:string,local:string,categoria:string){
    const response = await fetch(
    `/api/stock?fecha=${fecha}&local=${local}&categoria=${categoria}`
  );
  if (!response.ok) {
    throw new Error("Error vuelva a intentarlo mas tarde");
  }
  const data = await response.json()

  return data

}





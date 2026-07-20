
import {  getDataDay, actualizarMovimientos } from "../lib/historila";

const form = document.querySelector("#form") as HTMLFormElement;
const lista = document.querySelector("#lista") as HTMLDivElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fecha = (document.querySelector("#fecha") as HTMLInputElement).value;
  const local = (document.querySelector("#local") as HTMLSelectElement).value;
  const categoria = (document.querySelector("#categoria") as HTMLInputElement).value;

  const data = await getDataDay(fecha, local, categoria);
  console.log(data)
  // limpiar resultados anteriores
  lista.innerHTML = "";

  data.forEach((item:any) => {
    const fechaFormateada = new Date(item.fecha).toLocaleString("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
    const card = document.createElement("div");

card.innerHTML = `
  <div class="bg-white rounded-xl shadow-md p-4 space-y-4 border border-gray-200">

    <h3 class="text-lg font-semibold text-center text-gray-800">
      ${item.productos.nombre}
    </h3>
    <span>
    ${fechaFormateada}
    </span>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">
        Cantidad
      </label>
      <input
        type="number"
        class="cantidad w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
        value="${item.cantidad}"
        disabled
      >
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-600 mb-1">
        Estado
      </label>
      <select
        class="estado w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
        disabled
      >
        <option value="1" ${item.estado_id == 1 ? "selected" : ""}>Inicio</option>
        <option value="2" ${item.estado_id == 2 ? "selected" : ""}>Final</option>
        <option value="3" ${item.estado_id == 3 ? "selected" : ""}>Ingreso</option>
        <option value="4" ${item.estado_id == 4 ? "selected" : ""}>Envío</option>
        <option value="5" ${item.estado_id == 5 ? "selected" : ""}>Devolución</option>
        <option value="6" ${item.estado_id == 6 ? "selected" : ""}>Producción</option>
      </select>
    </div>

    <div class="flex gap-2">
      <button
        class="editar flex-1 rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition"
      >
        Editar
      </button>

      <button
        class="guardar flex-1 rounded-lg bg-green-600 text-white py-2 font-medium hover:bg-green-700 transition"
        hidden
      >
        Guardar
      </button>
    </div>

  </div>
`;

    const btnEditar = card.querySelector(".editar") as HTMLButtonElement
    const btnGuardar = card.querySelector(".guardar") as HTMLButtonElement
    const inputCantidad = card.querySelector(".cantidad") as HTMLInputElement
    const selectEstado = card.querySelector(".estado") as HTMLSelectElement
    btnEditar.addEventListener("click",() => {
      inputCantidad.disabled = false
      selectEstado.disabled = false

      btnEditar.hidden = true
      btnGuardar.hidden = false
      })
    btnGuardar.addEventListener("click",() => {
      inputCantidad.disabled = true
      selectEstado.disabled = true

      btnEditar.hidden = false
      btnGuardar.hidden = true

      const cantidadParseado = Number(inputCantidad.value)
      const estadoParseado = Number(selectEstado.value)
      actualizarMovimientos(item.id,cantidadParseado,estadoParseado)


      
    })

      lista.appendChild(card);


  });



});


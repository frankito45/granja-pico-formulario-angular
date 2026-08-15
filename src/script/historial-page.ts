
import {  getDataDay, actualizarMovimientos } from "../lib/historila";
import  type { Registro } from "../models/registro";
const form = document.querySelector("#form") as HTMLFormElement;
const lista = document.querySelector("#lista") as HTMLDivElement;

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fecha = (document.querySelector("#fecha") as HTMLInputElement).value;
  const local = (document.querySelector("#local") as HTMLSelectElement).value;
  const categoria = (document.querySelector("#categoria") as HTMLInputElement).value;

  const data:Registro[] = await getDataDay(fecha, local, categoria);
  
  const categoriaProdcutos = data.reduce((acc:any, registro:any) => {
    const nombre = registro.productos.nombre;
    const {
      id,
      fecha,
      cantidad,
      estado_id,
      productos,
      estados,
      ...resto
    } = registro;
    (acc[nombre] ??=[]).push(resto)
    return acc
  },{})

  const nombresCategorias = Object.keys(categoriaProdcutos);

 function dibujarCard() {
    lista.innerHTML = "";

    nombresCategorias.forEach((nombreCategoria) => {
      const card = document.createElement("div");
      card.className =
        "bg-white rounded-xl shadow-md p-4 border border-gray-200";

      const header = document.createElement("div");
      header.className = "cursor-pointer";

      header.innerHTML = `
        <h3 class="text-lg font-semibold text-center text-gray-800">
          ${nombreCategoria}
        </h3>
      `;

      card.appendChild(header);

      const detalles = document.createElement("div");
      detalles.className = "hidden mt-2";

      card.appendChild(detalles);
      lista.appendChild(card);

      header.addEventListener("click", () => {
        detalles.classList.toggle("hidden");

        // Solo renderizamos cuando se abre
        if (!detalles.classList.contains("hidden")) {
          detalles.innerHTML = "";

          // Filtrar solamente los registros de esta categoría
          const registrosCategoria = data.filter(
            (registro) =>
              registro.productos.nombre === nombreCategoria
          );

          // Crear los cards de los registros
          registrosCategoria.forEach((itemElement) => {
            const fechaUTC = new Date(itemElement.create_at);

            const fechaArgentina = fechaUTC.toLocaleString("es-AR", {
              timeZone: "America/Argentina/Buenos_Aires",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const detalle = document.createElement("div");

            detalle.className =
              "bg-white rounded-xl shadow-md p-4 m-3 border border-gray-200";

            detalle.innerHTML = `
              <span class="block text-sm text-gray-600 mb-2">
                Fecha de creación: ${fechaArgentina}
              </span>

              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                ${itemElement.productos.nombre}
              </h3>

              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Cantidad
                </label>

                <input
                  type="number"
                  class="cantidad w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  value="${itemElement.cantidad}"
                  disabled
                >
              </div>

              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-600 mb-1">
                  Estado
                </label>

                <select
                  class="estado w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  disabled
                >
                  <option value="1" ${
                    itemElement.estado_id == 1 ? "selected" : ""
                  }>
                    Inicio
                  </option>

                  <option value="2" ${
                    itemElement.estado_id == 2 ? "selected" : ""
                  }>
                    Final
                  </option>

                  <option value="3" ${
                    itemElement.estado_id == 3 ? "selected" : ""
                  }>
                    Ingreso
                  </option>

                  <option value="4" ${
                    itemElement.estado_id == 4 ? "selected" : ""
                  }>
                    Envío
                  </option>

                  <option value="5" ${
                    itemElement.estado_id == 5 ? "selected" : ""
                  }>
                    Devolución
                  </option>

                  <option value="6" ${
                    itemElement.estado_id == 6 ? "selected" : ""
                  }>
                    Producción
                  </option>
                  <option value="6" ${
                    itemElement.estado_id == 7 ? "selected" : ""
                  }>
                    Consumo
                  </option>
                </select>
              </div>

              <div class="flex gap-2">

                <button
                  type="button"
                  class="editar flex-1 rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition"
                >
                  Editar
                </button>

                <button
                  type="button"
                  class="guardar flex-1 rounded-lg bg-green-600 text-white py-2 font-medium hover:bg-green-700 transition"
                  hidden
                >
                  Guardar
                </button>

              </div>
            `;

            detalles.appendChild(detalle);

            // Elementos de ESTE registro
            const btnEditar =
              detalle.querySelector(".editar") as HTMLButtonElement;

            const btnGuardar =
              detalle.querySelector(".guardar") as HTMLButtonElement;

            const inputCantidad =
              detalle.querySelector(".cantidad") as HTMLInputElement;

            const selectEstado =
              detalle.querySelector(".estado") as HTMLSelectElement;

            // EDITAR
            btnEditar.addEventListener("click", (e) => {
              e.stopPropagation();

              inputCantidad.disabled = false;
              selectEstado.disabled = false;

              btnEditar.hidden = true;
              btnGuardar.hidden = false;
            });

            // GUARDAR
            btnGuardar.addEventListener("click", async (e) => {
              e.stopPropagation();

              const cantidadParseado = Number(inputCantidad.value);
              const estadoParseado = Number(selectEstado.value);

              if (Number.isNaN(cantidadParseado)) {
                alert("La cantidad no es válida");
                return;
              }

              try {
                // IMPORTANTE:
                // usamos directamente el ID del registro actual
                await actualizarMovimientos(
                  itemElement.id,
                  cantidadParseado,
                  estadoParseado
                );

                inputCantidad.disabled = true;
                selectEstado.disabled = true;

                btnEditar.hidden = false;
                btnGuardar.hidden = true;

                // Actualizar los datos locales también
                itemElement.cantidad = cantidadParseado;
                itemElement.estado_id = estadoParseado;

                console.log("Movimiento actualizado correctamente");
              } catch (error) {
                console.error(
                  "Error al actualizar el movimiento:",
                  error
                );

                alert("No se pudo actualizar el movimiento");
              }
            });
          });
        }
      });
    });
  }

  dibujarCard();



});


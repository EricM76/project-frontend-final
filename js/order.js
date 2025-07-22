// Constante para la clave de sessionStorage
const ORDER_DRINKS_KEY = "orderDrinksFree";

/**
 * Muestra un mensaje informativo que se cierra a los 3seg.
 * @param {string} text Texto que se desea mostrar
 */
function showMessage(text, icon) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: icon || "success",
    title: text,
  });
}

/**
 * Obtiene las bebidas del sessionStorage o inicializa un array vacío si no existe.
 * @returns {Array} Un array con las bebidas almacenadas.
 */
function getOrderDrinks() {
  const orderDrinksString = sessionStorage.getItem(ORDER_DRINKS_KEY);
  return orderDrinksString ? JSON.parse(orderDrinksString) : [];
}

/**
 * Guarda las bebidas en el sessionStorage.
 * @param {Array} drinks - El array de bebidas a guardar.
 */
function saveOrderDrinks(drinks) {
  sessionStorage.setItem(ORDER_DRINKS_KEY, JSON.stringify(drinks));
}

/**
 * Agrega una bebida a la lista de pedidos.
 * @param {Object} drink - El objeto de la bebida a agregar.
 */
function orderAdd(drink) {
  const order = getOrderDrinks();
  const searchDrink = order.find(d => d.id === drink.id)
  if(!searchDrink){
  order.push(drink);
  saveOrderDrinks(order);
  showMessage(drink.name + " fue agregado con éxito")
  return
  }
    showMessage(drink.name + " ya está incluído en el pedido.", "error")


}

/**
 * Elimina una bebida de la lista de pedidos por su ID y actualiza la UI del modal.
 * @param {string} idDrink - El ID de la bebida a eliminar.
 */
function orderItemRemove(idDrink) {
  let order = getOrderDrinks();
  const initialLength = order.length; // Para verificar si realmente se eliminó algo
  order = order.filter((d) => d.id !== idDrink);

  if (order.length < initialLength) {
    // Solo guardar si hubo un cambio
    saveOrderDrinks(order);
  }

  // Re-renderizar solo la lista de bebidas en el modal
  renderModalDrinksContent();
}

/**
 * Limpia el área de pedidos de bebidas, simulando el envío de solicitud de las mismas
 * @returns {void}
 */
function sendOrder() {
  sessionStorage.removeItem(ORDER_DRINKS_KEY);
  getOrderDrinks();
  renderModalDrinksContent();
  const closeButton = modalContent.querySelector(".order__close-button");
  closeButton.click();
  showMessage("Su pedido pronto estará listo para retirar en la barra.")
}

/**
 * Renderiza o actualiza el contenido de las bebidas dentro del modal.
 */
function renderModalDrinksContent() {
  const modalContentDrinks = document.getElementById("modalContentDrinks");
  const modalContent = document.getElementById("modalContent");
  const data = getOrderDrinks();

  // Limpiar el contenido existente de forma eficiente
  modalContentDrinks.innerHTML = "";

  if (data.length === 0) {
    // Si no hay bebidas, asegura que solo se muestre el mensaje "No hay bebidas solicitadas"
    modalContent.innerHTML = `
      <button class="order__close-button">&times;</button>
      <h2>Bebidas solicitadas</h2>
      <hr/><br/>
      <p class="order__info">No hay bebidas solicitadas</p>
    `;
  } else {
    // Si hay bebidas, renderiza la lista y asegura que el encabezado esté presente
    modalContent.innerHTML = `
      <button class="order__close-button">&times;</button>
      <h2>Bebidas solicitadas</h2>
      <hr/><br/>
    `;
    const fragment = document.createDocumentFragment(); // Usar un fragmento para menos manipulaciones del DOM
    data.forEach((drink) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span onclick="orderItemRemove('${drink.id}')">&times;</span>
        <img src="${drink.image}" width=100 alt="${drink.name}"/>
        <p>${drink.name}</p>
      `;
      fragment.appendChild(li);
    });
    modalContentDrinks.appendChild(fragment);
    const sendButton = document.createElement("button");
    sendButton.textContent = "Enviar pedido";
    sendButton.setAttribute("id", "order__send-button");
    sendButton.setAttribute("onclick", "sendOrder()");
    modalContent.appendChild(sendButton);
  }

  // Esto es crucial si modalContent.innerHTML fue usado para reemplazar todo el contenido
  if (!modalContent.contains(modalContentDrinks)) {
    modalContent.appendChild(modalContentDrinks);
  }

  // Asegura que el botón de cerrar siga funcionando si el modalContent.innerHTML se sobrescribió
  const closeButton = modalContent.querySelector(".order__close-button");
  if (closeButton) {
    closeButton.onclick = () => {
      const modalOverlay = document.querySelector(".order__modal-overlay");
      if (modalOverlay) modalOverlay.remove();
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const openModalLink = document.getElementById("openModalLink");
  const orderModalContainer = document.getElementById("orderModalContainer");

  openModalLink.addEventListener("click", (event) => {
    event.preventDefault();
    handleOrderModal();
  });

  /**
   * Maneja la apertura y el renderizado del modal de pedidos.
   */
  function handleOrderModal() {
    // Evitar abrir múltiples modales si ya hay uno abierto
    if (document.querySelector(".order__modal-overlay")) {
      return;
    }

    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("order__modal-overlay");

    const modalContent = document.createElement("div");
    modalContent.setAttribute("id", "modalContent");
    modalContent.classList.add("order__modal-content");

    const modalContentDrinks = document.createElement("ul");
    modalContentDrinks.setAttribute("id", "modalContentDrinks");

    // Inicializar el contenido base del modal antes de llenarlo con las bebidas
    modalContent.innerHTML = `
      <button class="order__close-button">&times;</button>
      <h2>Bebidas solicitadas</h2>
      <hr/><br/>
    `;
    modalContent.appendChild(modalContentDrinks); // Añadir el UL donde irán las bebidas

    modalOverlay.appendChild(modalContent);
    orderModalContainer.appendChild(modalOverlay);

    // Renderizar el contenido de las bebidas después de que el modal esté en el DOM
    renderModalDrinksContent();

    // Event listeners para cerrar el modal
    const closeButton = modalContent.querySelector(".order__close-button");
    closeButton.addEventListener("click", () => {
      modalOverlay.remove();
    });

    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        modalOverlay.remove();
      }
    });

    // Usar AbortController para manejar el evento de teclado de forma más limpia
    const abortController = new AbortController();
    document.addEventListener(
      "keydown",
      (event) => {
        if (
          event.key === "Escape" &&
          orderModalContainer.contains(modalOverlay)
        ) {
          modalOverlay.remove();
          abortController.abort(); // Detener el listener después de usarlo
        }
      },
      { signal: abortController.signal } // Asignar la señal del AbortController
    );
  }
});

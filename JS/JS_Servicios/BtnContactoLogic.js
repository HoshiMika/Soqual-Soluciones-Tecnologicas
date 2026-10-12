// BtnContactoLogic.js
document.addEventListener("DOMContentLoaded", () => {
  // Buscar elementos creados por BtnContactoInfo.js
  const modal = document.getElementById("modalTerminos");
  const btnAbrir = document.getElementById("btnAbrirModal");
  const btnCerrarIcon = document.getElementById("cerrarModal");
  const btnCerrar = document.getElementById("cerrarBtn");
  const btnAceptar = document.getElementById("aceptarTerminos");
  const chkAceptar = document.getElementById("acceptTerms");

  // Comprobaciones de seguridad: si falta markup, mostrar mensaje y no romper
  if (!modal || !btnAbrir || !btnCerrarIcon || !btnCerrar || !btnAceptar || !chkAceptar) {
    console.error("BtnContactoLogic: faltan elementos del modal. Asegúrate de cargar BtnContactoInfo.js antes que BtnContactoLogic.js");
    return;
  }

  // Estado inicial
  btnAceptar.disabled = true;
  chkAceptar.checked = false;

  // Abrir modal
  btnAbrir.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    // foco accesible
    chkAceptar.focus();
  });

  // Función cerrar (restablece estado)
  function cerrarModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    chkAceptar.checked = false;
    btnAceptar.disabled = true;
  }

  // Cerrar con icono o botón
  btnCerrarIcon.addEventListener("click", cerrarModal);
  btnCerrar.addEventListener("click", cerrarModal);

  // Habilitar/deshabilitar el botón Aceptar según checkbox
  chkAceptar.addEventListener("change", () => {
    btnAceptar.disabled = !chkAceptar.checked;
  });

  // Aceptar: sólo si está marcado
  btnAceptar.addEventListener("click", () => {
    if (!btnAceptar.disabled && chkAceptar.checked) {
      cerrarModal();
      // redirige en la misma pestaña
      window.location.href = "Contacto.html";
    }
  });

  // Cerrar al click fuera del modal-content
  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Cerrar con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") cerrarModal();
  });
});

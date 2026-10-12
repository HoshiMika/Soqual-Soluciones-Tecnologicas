// JS/ConexionPagina.js — Encabezado compartido por todas las páginas.
// Las rutas (src/href) se resuelven relativas al HTML, que vive en HTML/.
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("ConexionPagina");
  if (!container) {
    console.warn("ConexionPagina: contenedor #ConexionPagina no encontrado.");
    return;
  }

  const WHATSAPP_URL = "https://wa.me/message/5BKFE4JXYKZRD1";

  container.innerHTML = `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="container site-header__inner">
        <a class="site-brand" href="index.html" aria-label="Soqual Soluciones Tecnológicas, ir al inicio">
          <img src="../Imagenes/Logo_Nuevo.png" alt="" width="40" height="40">
          <span class="site-brand__name">
            Soqual
            <span class="site-brand__tagline">Soluciones Tecnológicas</span>
          </span>
        </a>

        <button class="site-nav__toggle" type="button"
                aria-expanded="false" aria-controls="menu-principal">
          <i class="fas fa-bars" aria-hidden="true"></i>
          <span class="visually-hidden">Abrir menú</span>
        </button>

        <nav class="site-nav" id="menu-principal" aria-label="Principal">
          <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="Servicios.html">Servicios</a></li>
            <li><a href="Galeria.html">Galería</a></li>
            <li><a href="Nosotros.html">Nosotros</a></li>
            <li><a href="Contacto.html">Contacto</a></li>
            <li>
              <a class="site-nav__cta" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-whatsapp" aria-hidden="true"></i> Escríbenos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  // Marcar la página actual (aria-current lo anuncia también a lectores de pantalla)
  const current = location.pathname.split("/").pop() || "index.html";
  container.querySelectorAll(".site-nav a").forEach((a) => {
    if (a.getAttribute("href") === current) a.setAttribute("aria-current", "page");
  });

  // Menú móvil
  const toggle = container.querySelector(".site-nav__toggle");
  const nav = container.querySelector(".site-nav");
  const label = toggle.querySelector(".visually-hidden");
  const icon = toggle.querySelector("i");
  const mobile = window.matchMedia("(max-width: 860px)");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Cerrar menú" : "Abrir menú";
    icon.className = open ? "fas fa-xmark" : "fas fa-bars";
    nav.hidden = mobile.matches && !open;
  };

  setOpen(false);
  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  mobile.addEventListener("change", () => setOpen(false));
});

// Archivo: Galeria.js
// ==========================================================================
// CÓMO AGREGAR UNA NUEVA FOTO O VIDEO DE UN TRABAJO REALIZADO
// ==========================================================================
// 1) Copia el archivo de la foto o el video dentro de:
//      - Fotos:  Imagenes/Galeria/fotos/
//      - Videos: Imagenes/Galeria/videos/
// 2) Agrega un nuevo objeto al arreglo GALERIA_ITEMS de abajo, copiando uno
//    de los ejemplos existentes y cambiando: tipo, categoria, titulo,
//    descripcion y src (y "poster" si es un video).
// 3) Guarda y recarga la página. No necesitas tocar nada más del código.
// ==========================================================================

const GALERIA_ITEMS = [
  {
    tipo: "imagen",
    categoria: "computadores",
    titulo: "Mantenimiento de equipos de escritorio",
    descripcion: "Diagnóstico, limpieza interna y optimización de rendimiento.",
    src: "../Imagenes/TecnicoComputadores.jpg"
  },
  {
    tipo: "imagen",
    categoria: "computadores",
    titulo: "Soporte técnico presencial",
    descripcion: "Reparación y mantenimiento correctivo en sitio.",
    src: "../Imagenes/Soporte.avif"
  },
  {
    tipo: "imagen",
    categoria: "aplicaciones",
    titulo: "Instalación y configuración de software",
    descripcion: "Licenciamiento e instalación de aplicaciones especializadas.",
    src: "../Imagenes/SoporteAplicaciones.avif"
  },
  {
    tipo: "imagen",
    categoria: "aplicaciones",
    titulo: "Soporte remoto de aplicaciones",
    descripcion: "Resolución de incidencias de software para clientes.",
    src: "../Imagenes/Aplicaciones.jpg"
  },
  {
    tipo: "imagen",
    categoria: "desarrollo",
    titulo: "Desarrollo de páginas web",
    descripcion: "Diseño y construcción de sitios web a la medida.",
    src: "../Imagenes/Desarrollo.avif"
  },
  {
    tipo: "imagen",
    categoria: "cctv",
    titulo: "Instalación de cámaras de seguridad",
    descripcion: "Montaje y configuración de sistemas de videovigilancia.",
    src: "../Imagenes/CCTV.avif"
  },
  // Ejemplo de cómo se vería un video (reemplaza el src cuando tengas uno real):
  {
    tipo: "video",
    categoria: "cctv",
    titulo: "Video de ejemplo: instalación de CCTV",
    descripcion: "Coloca aquí tu archivo .mp4 en Imagenes/Galeria/videos/ y actualiza el 'src'.",
    src: "../Imagenes/Galeria/videos/ejemplo.mp4",
    poster: "../Imagenes/CCTV.avif"
  }
];

const CATEGORIAS = [
  { valor: "todos", etiqueta: "Todos" },
  { valor: "computadores", etiqueta: "Computadores" },
  { valor: "aplicaciones", etiqueta: "Aplicaciones" },
  { valor: "desarrollo", etiqueta: "Desarrollo Web" },
  { valor: "cctv", etiqueta: "Cámaras de Seguridad" }
];

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Galeria");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Galeria'");
    return;
  }

  contenedor.innerHTML = `
    <section class="gallery-hero">
      <div class="container">
        <h2>Nuestros Trabajos</h2>
        <p>Así trabajamos: fotos y videos reales de instalaciones, soporte y proyectos entregados a nuestros clientes.</p>
      </div>
    </section>

    <section class="gallery-section">
      <div class="container">
        <div class="gallery-filters">
          ${CATEGORIAS.map((c, i) => `
            <button class="gallery-filter-btn ${i === 0 ? "active" : ""}" data-categoria="${c.valor}">
              ${c.etiqueta}
            </button>
          `).join("")}
        </div>

        <div class="gallery-grid" id="galleryGrid"></div>
      </div>
    </section>

    <div class="gallery-lightbox" id="galleryLightbox">
      <button class="gallery-lightbox-close" id="galleryLightboxClose"><i class="fas fa-times"></i></button>
      <div class="gallery-lightbox-content" id="galleryLightboxContent"></div>
    </div>
  `;

  renderGrid("todos");
  initFiltros();
  initLightbox();
});

function renderGrid(categoriaFiltro) {
  const grid = document.getElementById("galleryGrid");
  const items = categoriaFiltro === "todos"
    ? GALERIA_ITEMS
    : GALERIA_ITEMS.filter(item => item.categoria === categoriaFiltro);

  if (items.length === 0) {
    grid.innerHTML = `<p class="gallery-empty">Aún no hay evidencia en esta categoría.</p>`;
    return;
  }

  grid.innerHTML = items.map((item, index) => `
    <div class="gallery-card" data-index="${GALERIA_ITEMS.indexOf(item)}">
      <div class="gallery-thumb">
        ${item.tipo === "video"
          ? `<img src="${item.poster || item.src}" alt="${item.titulo}">
             <span class="gallery-play-icon"><i class="fas fa-play"></i></span>`
          : `<img src="${item.src}" alt="${item.titulo}">`
        }
      </div>
      <div class="gallery-card-info">
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".gallery-card").forEach(card => {
    card.addEventListener("click", () => abrirLightbox(Number(card.dataset.index)));
  });
}

function initFiltros() {
  const botones = document.querySelectorAll(".gallery-filter-btn");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGrid(btn.dataset.categoria);
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  const closeBtn = document.getElementById("galleryLightboxClose");

  closeBtn.addEventListener("click", cerrarLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) cerrarLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarLightbox();
  });
}

function abrirLightbox(index) {
  const item = GALERIA_ITEMS[index];
  const lightbox = document.getElementById("galleryLightbox");
  const content = document.getElementById("galleryLightboxContent");

  if (item.tipo === "video") {
    content.innerHTML = `
      <video controls autoplay poster="${item.poster || ""}">
        <source src="${item.src}" type="video/mp4">
      </video>
      <div class="gallery-lightbox-caption">
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      </div>
    `;
    // Si el video de ejemplo aún no existe, mostramos un aviso amigable
    const video = content.querySelector("video");
    video.addEventListener("error", () => {
      content.innerHTML = `
        <div class="gallery-video-fallback">
          <img src="${item.poster || ""}" alt="${item.titulo}">
          <p><i class="fas fa-video-slash"></i> Este video de ejemplo aún no se ha cargado.<br>
          Agrega el archivo en <code>Imagenes/Galeria/videos/</code>.</p>
        </div>
      `;
    });
  } else {
    content.innerHTML = `
      <img src="${item.src}" alt="${item.titulo}">
      <div class="gallery-lightbox-caption">
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
      </div>
    `;
  }

  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
  const lightbox = document.getElementById("galleryLightbox");
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("galleryLightboxContent").innerHTML = "";
}

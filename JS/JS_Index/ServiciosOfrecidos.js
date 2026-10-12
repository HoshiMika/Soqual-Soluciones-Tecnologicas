// Servicios destacados en la página de inicio.
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("ServiciosOfrecidos");
  if (!contenedor) return;

  const servicios = [
    {
      titulo: "Soporte en computadores",
      texto: "Reparación, mantenimiento y optimización de equipos de cómputo para hogares y empresas.",
      imagen: "../Imagenes/Soporte.avif",
      alt: "Computador de escritorio con iluminación morada sobre un escritorio",
      icono: "fa-laptop",
    },
    {
      titulo: "Soporte en aplicaciones",
      texto: "Instalación, configuración y resolución de problemas en software y aplicaciones especializadas.",
      imagen: "../Imagenes/SoporteAplicaciones.avif",
      alt: "Dos teléfonos inteligentes con la pantalla de inicio encendida",
      icono: "fa-mobile-screen",
    },
    {
      titulo: "Desarrollo web",
      texto: "Diseño y desarrollo de páginas web modernas, responsivas y optimizadas para SEO.",
      imagen: "../Imagenes/Desarrollo.avif",
      alt: "Portátil mostrando un panel web con gráficas de estadísticas",
      icono: "fa-code",
    },
    {
      titulo: "Cámaras de seguridad",
      texto: "Instalación y configuración de sistemas de videovigilancia para hogares y empresas.",
      imagen: "../Imagenes/CCTV.avif",
      alt: "Técnico manipulando un equipo",
      icono: "fa-video",
    },
  ];

  const items = servicios.map((s) => `
    <li class="service">
      <a class="service__link" href="Servicios.html">
        <div class="service__media">
          <img src="${s.imagen}" alt="${s.alt}" loading="lazy" width="640" height="420">
        </div>
        <div class="service__body">
          <h3><i class="fas ${s.icono}" aria-hidden="true"></i>${s.titulo}</h3>
          <p>${s.texto}</p>
          <span class="service__more">Ver detalle <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
        </div>
      </a>
    </li>
  `).join("");

  contenedor.innerHTML = `
    <section class="services" aria-labelledby="servicios-titulo">
      <div class="container">
        <div class="section-head">
          <h2 id="servicios-titulo">Nuestros servicios</h2>
          <p>Cuatro líneas de servicio para hogares y empresas.</p>
        </div>
        <ul class="services__grid">${items}</ul>
      </div>
    </section>
  `;
});

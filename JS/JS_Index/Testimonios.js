// Testimonios de clientes. El primero se muestra destacado.
const TESTIMONIOS = [
  {
    texto: "Excelente servicio técnico. Solucionaron todos los problemas de mi empresa de forma rápida y profesional. Muy recomendados.",
    nombre: "María Camila",
    cargo: "Directora de Tecnología",
  },
  {
    texto: "Llevo años confiando en Soqual para el mantenimiento de todos nuestros equipos. Siempre responden rápido y con soluciones efectivas.",
    nombre: "Javier Rodríguez",
    cargo: "Gerente de Sistemas",
  },
  {
    texto: "Instalaron las cámaras de seguridad en mi negocio y quedé muy satisfecho con la calidad y el profesionalismo del equipo.",
    nombre: "Ana Castillo",
    cargo: "Propietaria de restaurante",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Testimonios");
  if (!contenedor) return;

  const iniciales = (nombre) =>
    nombre.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const tarjeta = (t, i) => `
    <figure class="quote ${i === 0 ? "quote--featured" : ""}">
      <blockquote><p>${t.texto}</p></blockquote>
      <figcaption>
        <span class="quote__avatar" aria-hidden="true">${iniciales(t.nombre)}</span>
        <span><strong>${t.nombre}</strong><span>${t.cargo}</span></span>
      </figcaption>
    </figure>`;

  contenedor.innerHTML = `
    <section class="testimonials" aria-labelledby="testimonios-titulo">
      <div class="container">
        <div class="section-head">
          <h2 id="testimonios-titulo">Lo que dicen nuestros clientes</h2>
        </div>
        <div class="testimonials__grid">${TESTIMONIOS.map(tarjeta).join("")}</div>
      </div>
    </section>
  `;
});

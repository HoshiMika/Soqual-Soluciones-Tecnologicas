// Novedades: lista de noticias. Para agregar una, añade un objeto al inicio del arreglo.
const NOVEDADES = [
  {
    titulo: "Soqual ST anuncia el lanzamiento de su nueva página web para ampliar su alcance y garantizar mayor confidencialidad",
    fecha: "2025-10-30",
    fuente: "Soqual ST Blog",
  },
  {
    titulo: "Soqual ST anuncia nueva línea de soporte técnico remoto 24/7",
    fecha: "2025-09-06",
    fuente: "Soqual ST Blog",
  },
  {
    titulo: "Nuevas medidas de ciberseguridad para empresas colombianas",
    fecha: "2025-09-05",
    fuente: "El Tiempo Tecnología",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("NovedadesEmpresa");
  if (!contenedor) return;

  const formato = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" });

  const items = NOVEDADES.map((n) => {
    const fecha = new Date(`${n.fecha}T12:00:00`);
    return `
      <li class="news__item">
        <time datetime="${n.fecha}">${formato.format(fecha)}</time>
        <h3>${n.titulo}</h3>
        <p class="news__source">${n.fuente}</p>
      </li>`;
  }).join("");

  contenedor.innerHTML = `
    <section class="news" aria-labelledby="novedades-titulo">
      <div class="container news__grid">
        <div class="section-head section-head--side">
          <h2 id="novedades-titulo">Novedades tecnológicas</h2>
          <p>Anuncios de Soqual y noticias del sector que afectan a hogares y empresas.</p>
        </div>
        <ol class="news__list">${items}</ol>
      </div>
    </section>
  `;
});

// Análisis tecnológico.
// ⚠️ La cifra del 40% necesita una fuente verificable (estudio, informe o medio).
//    Agrega el nombre de la fuente en FUENTE_ANALISIS; si no la tienes, es mejor quitar la cifra.
const FUENTE_ANALISIS = "";

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("AnalisisTecnologico");
  if (!contenedor) return;

  contenedor.innerHTML = `
    <section class="analysis" aria-labelledby="analisis-titulo">
      <div class="container analysis__grid">
        <h2 id="analisis-titulo">Análisis tecnológico</h2>
        <div class="analysis__body">
          <p class="analysis__lead">
            Según analistas del sector, la demanda de servicios de soporte técnico especializado
            ha crecido un 40% en el último año, con un aumento significativo en requerimientos
            de seguridad informática y transformación digital para pequeñas y medianas empresas.
          </p>
          ${FUENTE_ANALISIS ? `<p class="analysis__source">Fuente: ${FUENTE_ANALISIS}</p>` : ""}
          <p>
            Soqual ST se posiciona como una de las empresas con mayor crecimiento en el sector,
            gracias a su enfoque en soluciones personalizadas y respuesta inmediata a emergencias tecnológicas.
          </p>
        </div>
      </div>
    </section>
  `;
});

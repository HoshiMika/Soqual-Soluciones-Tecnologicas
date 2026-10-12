// Oferta por tiempo limitado con cuenta regresiva real.
// ▸ Para cambiar la promoción, edita solo este objeto.
// ▸ Cuando la fecha de fin pasa, la sección se oculta sola.
const PROMOCION = {
  titulo: "Mantenimiento preventivo con 30% de descuento",
  detalle: "Oferta por tiempo limitado. Agenda tu cita por WhatsApp.",
  fin: "2026-10-31T23:59:59-05:00", // Fecha y hora de fin (hora de Colombia)
};

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Ofertas");
  if (!contenedor) return;

  const fin = new Date(PROMOCION.fin);
  if (Number.isNaN(fin.getTime()) || fin <= new Date()) return; // Promoción vencida: no se muestra

  contenedor.innerHTML = `
    <section class="offer" aria-labelledby="oferta-titulo">
      <div class="container">
        <div class="offer__panel">
          <div class="offer__text">
            <h2 id="oferta-titulo">${PROMOCION.titulo}</h2>
            <p>${PROMOCION.detalle}</p>
            <a class="button button--primary" href="https://wa.me/message/5BKFE4JXYKZRD1"
               target="_blank" rel="noopener noreferrer">
              <i class="fab fa-whatsapp" aria-hidden="true"></i> Agendar mantenimiento
            </a>
          </div>
          <div class="offer__timer" role="timer" aria-live="off" aria-label="Tiempo restante de la oferta">
            <div><span data-unidad="dias">00</span><small>días</small></div>
            <div><span data-unidad="horas">00</span><small>horas</small></div>
            <div><span data-unidad="minutos">00</span><small>min</small></div>
          </div>
        </div>
      </div>
    </section>
  `;

  const campos = {
    dias: contenedor.querySelector('[data-unidad="dias"]'),
    horas: contenedor.querySelector('[data-unidad="horas"]'),
    minutos: contenedor.querySelector('[data-unidad="minutos"]'),
  };
  const dos = (n) => String(n).padStart(2, "0");

  const actualizar = () => {
    const resta = fin - new Date();
    if (resta <= 0) {
      contenedor.innerHTML = "";
      clearInterval(intervalo);
      return;
    }
    const min = Math.floor(resta / 60000);
    campos.dias.textContent = dos(Math.floor(min / 1440));
    campos.horas.textContent = dos(Math.floor((min % 1440) / 60));
    campos.minutos.textContent = dos(min % 60);
  };

  const intervalo = setInterval(actualizar, 30000);
  actualizar();
});

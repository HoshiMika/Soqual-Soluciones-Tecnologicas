document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("ServicioParrafo");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='ServicioParrafo'");
    return;
  }

  contenedor.innerHTML = `
    <section class="services-hero">
      <div class="container">
        <h2>Nuestros Servicios</h2>
        <p>Conozca nuestros servicios tecnológicos, desarrollados para brindar soluciones efectivas que atiendan sus requerimientos específicos.</p>
      </div>
    </section>
  `;
});

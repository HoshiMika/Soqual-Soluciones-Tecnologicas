document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Contactenos");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Contactenos'");
    return;
  }

  contenedor.innerHTML = `
    <section class="contact-hero">
      <div class="container">
        <h2>Contáctanos</h2>
        <p>Estamos aquí para ayudarte. Ponte en contacto con nosotros a través del formulario o utilizando cualquiera de nuestros medios de comunicación.</p>
      </div>
    </section>
  `;
});
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("InfoContacto");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='InfoContacto'");
    return;
  }

  contenedor.innerHTML = `
    <main class="container">
      <section class="intro">
          <h2>Información de Contacto</h2>
          <p>En esta página encontrarás nuestros datos de contacto, información de la empresa y un formulario para contactarnos directamente.</p>
      </section>
    </main>
  `;
});
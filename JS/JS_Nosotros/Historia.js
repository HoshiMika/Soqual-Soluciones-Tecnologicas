// Archivo: Historia.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Historia");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Historia'");
    return;
  }

  contenedor.innerHTML += `
    <section class="about-hero">
        <div class="container about-hero-content">
            <h2>Nuestra Historia</h2>
            <p>De un emprendimiento pandémico a líderes en soluciones tecnológicas</p>
        </div>
    </section>
  `;
});

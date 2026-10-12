// Archivo: FormacionAcademica.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("InformacionAcademica");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='InformacionAcademica'");
    return;
  }

  contenedor.innerHTML = `
    <section class="academic-info">
      <div class="container">
        <h3><i class="fas fa-graduation-cap"></i> Formación Académica</h3>
        <p><strong>Programa:</strong> Ingeniería de Software - Fundación Universitaria Compensar</p>
        <p><strong>Curso Actual:</strong> Introducción a los Lenguajes de Internet - Desarrollo de aplicaciones web</p>
      </div>
    </section>
  `;
});

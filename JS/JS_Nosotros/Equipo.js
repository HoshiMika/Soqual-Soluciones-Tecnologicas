// Archivo: Equipo.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Equipo");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Equipo'");
    return;
  }

  contenedor.innerHTML += `
    <section class="team">
        <div class="container">
            <h2 class="section-title">Nuestro Equipo</h2>
            <p class="about-text">Contamos con un equipo multidisciplinario de profesionales apasionados por la tecnología y comprometidos con la excelencia en el servicio.</p>
            
            <div class="team-grid">
                <div class="team-member">
                    <div class="team-img">
                        <img src="../Imagenes/Foto_CV.jpg" alt="Juan David Bayona - Fundador & CEO">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">Juan David Bayona Castañeda</h3>
                        <p class="team-position">Fundador & CEO</p>
                        <p>Visionario detrás de Soqual, con más de 10 años de experiencia en soluciones tecnológicas. Lideró la transformación de la empresa desde sus inicios como emprendimiento pandémico.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="team-img">
                        <img src="../Imagenes/HernanCoba.jpg" alt="Hernan Dario Coba - Gerente de Relaciones Estratégicas">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">Hernan Dario Coba Alferez</h3>
                        <p class="team-position">Gerente de Relaciones Estratégicas</p>
                        <p>Experto en gestión de relaciones con clientes estratégicos y desarrollo de alianzas comerciales. Garantiza la máxima satisfacción de nuestros clientes.</p>
                    </div>
                </div>
                
                <div class="team-member">
                    <div class="team-img">
                        <img src="../Imagenes/AndresLopez.jpg" alt="Andres López - Especialista en Soporte Técnico">
                    </div>
                    <div class="team-info">
                        <h3 class="team-name">Andres Mauricio López</h3>
                        <p class="team-position">Especialista en Soporte Técnico</p>
                        <p>Certificado en hardware, software y soluciones de conectividad. Más de 7 años de experiencia resolviendo problemas técnicos complejos.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `;
});

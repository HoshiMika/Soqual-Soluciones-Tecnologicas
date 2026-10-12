// Archivo: Logros.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Logros");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Logros'");
    return;
  }

  contenedor.innerHTML += `
    <section class="stats">
        <div class="container">
            <h2 class="section-title" style="color: white;">Nuestros Logros</h2>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">100+</div>
                    <div class="stat-text">Clientes Satisfechos</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number">5+</div>
                    <div class="stat-text">Años de Experiencia</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number">98%</div>
                    <div class="stat-text">Clientes Fieles</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number">500+</div>
                    <div class="stat-text">Equipos Reparados</div>
                </div>
            </div>
        </div>
    </section>
  `;
});

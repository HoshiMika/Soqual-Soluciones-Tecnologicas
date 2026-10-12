// Archivo: Vision.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Pilares");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Pilares'");
    return;
  }

  contenedor.innerHTML += `
    <section class="mission">
        <div class="container">
            <h2 class="section-title">Nuestros Pilares</h2>
            
            <div class="mission-grid">
                <div class="mission-card">
                    <div class="mission-icon">
                        <i class="fas fa-hands-helping"></i>
                    </div>
                    <h3>Compromiso Social</h3>
                    <p>Nacimos para ayudar en momentos difíciles y mantenemos ese compromiso con nuestras comunidades, ofreciendo precios justos y apoyo a quienes más lo necesitan.</p>
                </div>
                
                <div class="mission-card">
                    <div class="mission-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <h3>Innovación Constante</h3>
                    <p>Mantenemosnos actualizados con las últimas tendencias tecnológicas para ofrecer siempre soluciones de vanguardia a nuestros clientes.</p>
                </div>
                
                <div class="mission-card">
                    <div class="mission-icon">
                        <i class="fas fa-heart"></i>
                    </div>
                    <h3>Pasión por Servir</h3>
                    <p>Creemos que la tecnología debe servir a las personas, no al revés. Por eso nos enfocamos en soluciones humanizadas y accesibles.</p>
                </div>
            </div>
        </div>
    </section>
  `;
});

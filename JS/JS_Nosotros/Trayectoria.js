// Archivo: Trayectoria.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Trayectoria");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Trayectoria'");
    return;
  }

  contenedor.innerHTML += `
    <section class="timeline">
        <div class="container">
            <h2 class="section-title">Nuestra Trayectoria</h2>
            
            <div class="timeline-container">
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">2020</div>
                        <h3>Nacimiento en Pandemia</h3>
                        <p>Soqual nace como respuesta a las necesidades de conectividad y soporte técnico durante el confinamiento por COVID-19, brindando apoyo esencial para el teletrabajo.</p>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">2021</div>
                        <h3>Expansión y Crecimiento</h3>
                        <p>Atendimos a más de 10 clientes potenciales, brindándoles soluciones eficaces en el arreglo de sus equipos tecnológicos y mejorando su conectividad.</p>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">2025</div>
                        <h3>Consolidación en el Mercado</h3>
                        <p>Hemos atendido a más de 100 clientes, manteniendo relaciones duraderas con quienes confían en nuestros servicios desde 2020.</p>
                    </div>
                </div>
                
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-date">Actualidad</div>
                        <h3>Lanzamiento de Plataforma Web</h3>
                        <p>Lanzamos nuestra página web oficial para ampliar nuestro alcance y ofrecer mejores servicios a nuestra creciente cartera de clientes.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  `;
});

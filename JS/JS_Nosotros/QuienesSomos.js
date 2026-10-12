// Archivo: QuienesSomos.js
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("QuienesSomos");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='QuienesSomos'");
    return;
  }

  contenedor.innerHTML += `
    <section class="about-content">
        <div class="container">
            <h2 class="section-title">¿Quiénes Somos?</h2>
            <div class="about-text">
                <p>Soqual Soluciones Tecnológicas nació en el año 2020 como un emprendimiento que surgió a raíz de la pandemia. En un momento donde el mundo se confinó y las personas se vieron obligadas a permanecer encerradas, identificamos la oportunidad de brindar soporte técnico y apoyo en la conectividad laboral para facilitar la continuidad de las operaciones entre las personas y sus respectivas empresas.</p>
                
                <p>Desde nuestros inicios, nos enfocamos en resolver los problemas tecnológicos que impedían a las personas trabajar y conectarse eficientemente desde sus hogares. Lo que comenzó como una iniciativa para ayudar a comunidades y empresas a adaptarse al teletrabajo y la educación virtual, rápidamente evolucionó hacia una empresa integral de soluciones tecnológicas.</p>
                
                <p>Nuestra misión siempre ha sido clara: facilitar el acceso a soporte técnico de calidad y hacer que la tecnología sea accesible para todos, especialmente en momentos donde la conectividad se volvió esencial para la continuidad laboral y personal.</p>
            </div>
            
            <div class="about-highlights">
                <div class="highlight-card">
                    <div class="highlight-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <h3>Nuestro Inicio</h3>
                    <p>Nacimos en 2020 para responder a las necesidades de conectividad durante la pandemia, apoyando a empresas y personas en su adaptación al teletrabajo.</p>
                </div>
                
                <div class="highlight-card">
                    <div class="highlight-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <h3>Nuestra Misión</h3>
                    <p>Facilitar el acceso a soluciones tecnológicas de calidad, brindando soporte especializado que impulse la productividad y conectividad de nuestros clientes.</p>
                </div>
                
                <div class="highlight-card">
                    <div class="highlight-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <h3>Nuestra Visión</h3>
                    <p>Ser reconocidos como el partner tecnológico de confianza para hogares y empresas, liderando la transformación digital con soluciones innovadoras y accesibles.</p>
                </div>
            </div>
        </div>
    </section>
  `;
});

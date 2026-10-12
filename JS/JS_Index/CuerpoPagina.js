// Sección principal (hero) de la página de inicio.
document.addEventListener("DOMContentLoaded", () => {
  const cont = document.getElementById("CuerpoPagina");
  if (!cont) return;

  cont.innerHTML = `
    <section class="hero" aria-labelledby="hero-titulo">
      <div class="container hero__grid">
        <div class="hero__text">
          <h1 id="hero-titulo">Soporte técnico especializado en tecnología</h1>
          <p class="hero__lead">
            Soluciones integrales para computadores, aplicaciones, páginas web
            y sistemas de seguridad, para hogares y empresas.
          </p>
          <div class="hero__actions">
            <a class="button button--primary" href="https://wa.me/message/5BKFE4JXYKZRD1"
               target="_blank" rel="noopener noreferrer">
              <i class="fab fa-whatsapp" aria-hidden="true"></i> Solicitar soporte
            </a>
            <a class="button button--ghost" href="Servicios.html">Ver servicios</a>
          </div>
          <ul class="hero__facts">
            <li><i class="fas fa-clock" aria-hidden="true"></i> Emergencias técnicas 24/7</li>
            <li><i class="fas fa-location-dot" aria-hidden="true"></i> Soacha, Cundinamarca</li>
            <li><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:+573204073004">320 407 3004</a></li>
          </ul>
        </div>
        <div class="hero__visual">
          <img src="../Imagenes/Logo_Nuevo.png" alt="Robot de Soqual, la mascota de la marca"
               width="788" height="788" fetchpriority="high">
        </div>
      </div>
    </section>
  `;
});

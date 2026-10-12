// JS/DatosContacto.js — Pie de página compartido por todas las páginas.
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("DatosContacto");
  if (!contenedor) {
    console.error("No se encontró el elemento con id='DatosContacto'");
    return;
  }

  const anio = new Date().getFullYear();

  contenedor.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__grid">

          <div class="site-footer__brand">
            <h2>Soqual Soluciones Tecnológicas</h2>
            <p>Soluciones tecnológicas integrales para hogares y empresas en Colombia.</p>
            <div class="site-footer__social">
              <a href="https://www.facebook.com/Soqualst" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Soqual">
                <i class="fab fa-facebook-f" aria-hidden="true"></i>
              </a>
              <a href="https://wa.me/message/5BKFE4JXYKZRD1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Soqual">
                <i class="fab fa-whatsapp" aria-hidden="true"></i>
              </a>
              <a href="https://www.linkedin.com/in/juan-david-bayona/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i class="fab fa-linkedin-in" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div>
            <h3>Contacto</h3>
            <ul>
              <li><i class="fas fa-phone" aria-hidden="true"></i><a href="tel:+573204073004">320 407 3004</a></li>
              <li><i class="fas fa-envelope" aria-hidden="true"></i><a href="mailto:soqualst@gmail.com">soqualst@gmail.com</a></li>
              <li><i class="fas fa-location-dot" aria-hidden="true"></i><span>Calle 6B #6A-66, Soacha</span></li>
            </ul>
          </div>

          <div>
            <h3>Horario de atención</h3>
            <dl class="site-footer__hours">
              <dt>Lunes a viernes</dt><dd>7:00 a. m. – 5:00 p. m.</dd>
              <dt>Sábados</dt><dd>9:00 a. m. – 2:00 p. m.</dd>
              <dt>Emergencias técnicas</dt><dd>24/7</dd>
            </dl>
          </div>
        </div>

        <div class="site-footer__bottom">
          <p>&copy; ${anio} Soqual Soluciones Tecnológicas. Todos los derechos reservados.</p>
          <p><a href="Contacto.html">Contacto</a></p>
        </div>
      </div>
    </footer>
  `;
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("Inicio").innerHTML = `
    <header>
        <div class="container">
            <div class="logo-container">
                <div class="logo">
                    <img src="../Imagenes/Logo.png" alt="Soqual Logo">
                    <div>
                        <h1>Soqual <span>Soluciones Tecnológicas</span></h1>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li><a href="#"><i class="fas fa-home"></i> Inicio</a></li>
                        <li><a href="Servicios.html" target="_blank"><i class="fas fa-cogs"></i> Servicios</a></li>
                        <li><a href="Nosotros.html" target="_blank"><i class="fas fa-users"></i> Nosotros</a></li>
                        <li><a href="Contacto.html" target="_blank"><i class="fas fa-phone"></i> Contacto</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero">
        <div class="container hero-content">
            <h2>Soporte Técnico Especializado en Tecnología</h2>
            <p>Soluciones integrales para computadores, aplicaciones, páginas web y sistemas de seguridad</p>
            <button id="abrirModalBtn" class="btn">Solicitar Soporte <i class="fas fa-arrow-right"></i></button>
        </div>

        <div id="modalOverlay" class="overlay">
            <div class="modal">
                <h2>Términos y Condiciones</h2>
                <div class="modal-content">
                    <p>Al solicitar nuestros servicios de soporte técnico, aceptas los siguientes términos y condiciones:</p>
                    <p>1. Los servicios están sujetos a disponibilidad y pueden requerir cita previa.</p>
                    <p>2. El tiempo de respuesta puede variar según la complejidad del problema y la carga de trabajo.</p>
                    <p>3. Soqual ST se reserva el derecho de modificar estos términos en cualquier momento.</p>
                    <p>4. Tu privacidad es importante para nosotros y protegemos tus datos según nuestra política de privacidad.</p>
                    <p>5. Para servicios de emergencia, aplican tarifas especiales fuera del horario laboral.</p>
                    <p>6. El cliente debe proporcionar un entorno seguro para que nuestros técnicos realicen su trabajo.</p>
                    <p>7. Soqual ST no se hace responsable por daños preexistentes en los equipos.</p>
                    <div class="terms-checkbox">
                        <input type="checkbox" id="acceptTerms">
                        <label for="acceptTerms">He leído y acepto los términos y condiciones</label>
                    </div>
                </div>
                <div class="modal-actions">
                    <button id="aceptarTerminosBtn" disabled>Aceptar y Continuar</button>
                    <button id="cerrarModalBtn">Cerrar</button>
                </div>
            </div>
        </div>
    </section>
  `;
});

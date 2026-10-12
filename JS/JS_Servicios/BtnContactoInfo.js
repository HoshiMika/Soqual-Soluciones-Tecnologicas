// BtnContactoInfo.js
document.addEventListener("DOMContentLoaded", () => {
  const cont = document.getElementById("BtnContactoInfo");

  // Si el contenedor no existe, mostrar advertencia y detener ejecución
  if (!cont) {
    console.error("❌ No se encontró el contenedor con id='BtnContactoInfo'. Asegúrate de que exista en el HTML antes de este script.");
    return;
  }

  // Insertar el contenido dentro del contenedor existente
  cont.innerHTML = `
    <section class="contact-banner">
      <div class="container">
        <h3>¿Necesitas alguno de nuestros servicios?</h3>
        <p>Contáctanos ahora mismo para recibir asesoría personalizada</p>
        <button id="btnAbrirModal" class="btn">Contactar</button>
      </div>
    </section>

    <!-- Modal de Términos y Condiciones -->
    <div id="modalTerminos" class="modal" style="display:none;">
      <div class="modal-content">
        <span class="close" id="cerrarModal" role="button" aria-label="Cerrar">&times;</span>
        <h2>Términos y Condiciones</h2>
        <p>Al solicitar nuestros servicios de soporte técnico, aceptas los siguientes términos y condiciones:</p>
        <ol>
          <li>Los servicios están sujetos a disponibilidad y pueden requerir cita previa.</li>
          <li>El tiempo de respuesta puede variar según la complejidad del problema y la carga de trabajo.</li>
          <li>Soqual ST se reserva el derecho de modificar estos términos en cualquier momento.</li>
          <li>Tu privacidad es importante para nosotros y protegemos tus datos según nuestra política de privacidad.</li>
          <li>Para servicios de emergencia, aplican tarifas especiales fuera del horario laboral.</li>
          <li>El cliente debe proporcionar un entorno seguro para que nuestros técnicos realicen su trabajo.</li>
          <li>Soqual ST no se hace responsable por daños preexistentes en los equipos.</li>
        </ol>

        <div class="terms-checkbox">
          <input type="checkbox" id="acceptTerms">
          <label for="acceptTerms">He leído y acepto los términos y condiciones</label>
        </div>

        <div class="modal-actions">
          <button id="aceptarTerminos" class="btn" disabled>Aceptar y Continuar</button>
          <button id="cerrarBtn" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  `;
});

// Archivo: Formulario.js
// Formulario de contacto -> guarda cada soporte en Google Sheets (gratis, ilimitado)
// y además envía una notificación por correo a través de Formspree.

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("Formulario");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='Formulario'");
    return;
  }

  contenedor.innerHTML = `
    <section class="contact-form">
      <h2>Formulario de Contacto</h2>
      <p>Si deseas contactarnos, completa el siguiente formulario y nos pondremos en contacto contigo a la brevedad.</p>

      <form id="contactForm">
          <div class="form-group">
              <label for="name">Nombre completo</label>
              <input type="text" id="name" name="name" placeholder="Ingresa tu nombre completo" required>
          </div>

          <div class="form-group">
              <label for="email">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="Ingresa tu correo electrónico" required>
          </div>

          <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" name="phone" placeholder="Ingresa tu número de teléfono">
          </div>

          <div class="form-group">
              <label for="subject">Asunto</label>
              <input type="text" id="subject" name="subject" placeholder="Asunto del mensaje" required>
          </div>

          <div class="form-group">
              <label for="message">Mensaje</label>
              <textarea id="message" name="message" placeholder="Escribe tu mensaje aquí..." required></textarea>
          </div>

          <button type="submit" class="btn"><i class="fas fa-paper-plane"></i> Enviar mensaje</button>
      </form>

      <div id="messageContainer"></div>
    </section>
  `;

  initFormHandler();
});

// ==========================================================================
// CONFIGURACIÓN DE DESTINOS DE ALMACENAMIENTO
// ==========================================================================
// 1) GOOGLE_SHEETS_URL: pega aquí la URL que te entrega Google al desplegar
//    el Apps Script como "Aplicación web" (ver archivo GoogleSheets/Code.gs
//    y las instrucciones en GoogleSheets/INSTRUCCIONES.md incluidas en el
//    proyecto). Mientras no la reemplaces, el formulario seguirá funcionando
//    solo con Formspree.
// 2) FORMSPREE_URL: ya está configurado y sirve como notificación inmediata
//    por correo (plan gratis: hasta 50 envíos/mes).
// ==========================================================================
const GOOGLE_SHEETS_URL = "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT";
const FORMSPREE_URL = "https://formspree.io/f/mjkjkzoa";

function initFormHandler() {
  const contactForm = document.getElementById('contactForm');
  const messageContainer = document.getElementById('messageContainer');

  // Envía los datos a la hoja de Google Sheets (base de datos gratuita)
  async function enviarAGoogleSheets(datos) {
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL.includes("PEGA_AQUI")) {
      console.warn("Google Sheets no configurado todavía: revisa GoogleSheets/INSTRUCCIONES.md");
      return false;
    }

    // Se usa 'no-cors' + URLSearchParams porque Apps Script Web Apps no
    // permite leer la respuesta desde el navegador de forma sencilla.
    // Esto es "fire and forget": si no lanza error de red, se asume enviado.
    const params = new URLSearchParams(datos);
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: params.toString()
    });
    return true;
  }

  // Envía los datos a Formspree (notificación inmediata por correo)
  async function enviarAFormspree(datos) {
    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  }

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    const formData = {
      nombre: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('phone').value.trim(),
      asunto: document.getElementById('subject').value.trim(),
      mensaje: document.getElementById('message').value.trim(),
      fecha: new Date().toLocaleString('es-CO')
    };

    try {
      if (!formData.nombre || !formData.email || !formData.asunto || !formData.mensaje) {
        throw new Error('Por favor, completa todos los campos requeridos');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Por favor, ingresa un email válido');
      }

      // Se envía en paralelo a ambos destinos. Si uno falla, no bloquea al otro.
      const resultados = await Promise.allSettled([
        enviarAGoogleSheets(formData),
        enviarAFormspree(formData)
      ]);

      const algunoExitoso = resultados.some(r => r.status === 'fulfilled' && r.value !== false);

      if (algunoExitoso) {
        showMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
        contactForm.reset();
      } else {
        throw new Error('No se pudo enviar el mensaje a ningún destino. Intenta nuevamente.');
      }

      resultados.forEach(r => {
        if (r.status === 'rejected') console.error('Fallo un canal de envío:', r.reason);
      });

    } catch (error) {
      console.error('Error al procesar el formulario:', error);

      let mensajeError = error.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.';

      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        mensajeError = 'Error de conexión con el servidor. Verifica tu conexión a internet e intenta nuevamente.';
      }

      showMessage(mensajeError, 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  });

  function showMessage(message, type) {
    messageContainer.textContent = message;
    messageContainer.className = `message ${type}`;
    messageContainer.style.display = 'block';
    messageContainer.style.padding = '10px';
    messageContainer.style.margin = '10px 0';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.fontWeight = 'bold';

    if (type === 'success') {
      messageContainer.style.backgroundColor = '#d4edda';
      messageContainer.style.color = '#155724';
      messageContainer.style.border = '1px solid #c3e6cb';
    } else {
      messageContainer.style.backgroundColor = '#f8d7da';
      messageContainer.style.color = '#721c24';
      messageContainer.style.border = '1px solid #f5c6cb';
    }

    if (type === 'success') {
      setTimeout(() => { messageContainer.style.display = 'none'; }, 5000);
    }
  }

  const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', function () { validateField(this); });
    input.addEventListener('input', function () {
      if (this.value.trim()) this.style.borderColor = '';
    });
  });

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && !value) {
      field.style.borderColor = '#e53e3e';
      return false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        field.style.borderColor = '#e53e3e';
        return false;
      }
    }

    field.style.borderColor = '#38a169';
    return true;
  }
}

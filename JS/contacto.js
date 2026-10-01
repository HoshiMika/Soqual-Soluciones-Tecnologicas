// contacto.js - Envío del formulario de contacto a la API
const form = document.getElementById('contact-form');

if (form) {
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const message = form.elements.mensaje;
  const counter = document.getElementById('mensaje-count');

  // Si la página se abre con Live Server (puerto 5501), la API vive en el servidor Node (puerto 3000)
  const API_URL = location.port === '5501' ? 'http://localhost:3000/api/enviar' : '/api/enviar';

  // Prellenar el asunto desde ?servicio=... (enlaces de la página de servicios)
  const servicio = new URLSearchParams(location.search).get('servicio');
  if (servicio && !form.elements.asunto.value) form.elements.asunto.value = servicio;

  const updateCounter = () => {
    counter.textContent = `${message.value.length} / ${message.maxLength}`;
  };
  message.addEventListener('input', updateCounter);
  updateCounter();

  const showStatus = (type, text) => {
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', loading: 'fa-paper-plane' };
    status.className = `form-status is-visible is-${type}`;
    status.innerHTML = `<i class="fas ${icons[type]}" aria-hidden="true"></i><span></span>`;
    status.querySelector('span').textContent = text;
  };

  const setLoading = (loading) => {
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = Object.fromEntries(
      [...new FormData(form)].map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])
    );

    setLoading(true);
    showStatus('loading', 'Enviando tu mensaje…');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        showStatus('success', '¡Mensaje enviado! Te responderemos lo antes posible.');
        form.reset();
        updateCounter();
      } else {
        const msg = json.error || json.errors?.map((err) => err.msg).join('. ') || 'No pudimos enviar el mensaje.';
        showStatus('error', msg);
      }
    } catch {
      showStatus('error', 'No hay conexión con el servidor. Escríbenos por WhatsApp mientras lo solucionamos.');
    } finally {
      setLoading(false);
    }
  });
}

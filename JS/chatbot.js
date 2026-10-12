// chatbot.js - Asistente virtual de la página de contacto
// Las respuestas las genera el servidor (/api/chat); la clave de Gemini nunca llega al navegador.
const chatToggle = document.querySelector('[data-chat-toggle]');
const chatPanel = document.getElementById('chat-panel');

if (chatToggle && chatPanel) {
  // Si la página se abre con Live Server (puerto 5501), la API vive en el servidor Node (puerto 3000)
  const API_URL = location.port === '5501' ? 'http://localhost:3000/api/chat' : '/api/chat';
  // Número impar: así el historial que se envía siempre empieza con un mensaje del cliente
  const MAX_HISTORY = 11;

  const log = chatPanel.querySelector('.chat-log');
  const form = chatPanel.querySelector('.chat-form');
  const input = form.elements.mensaje;
  const sendBtn = form.querySelector('button[type="submit"]');
  const history = [];

  const setOpen = (open) => {
    chatPanel.hidden = !open;
    chatToggle.setAttribute('aria-expanded', String(open));
    chatToggle.setAttribute('aria-label', open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual');
    chatToggle.querySelector('i').className = open ? 'fas fa-xmark' : 'fas fa-robot';
    if (open) input.focus();
  };

  chatToggle.addEventListener('click', () => setOpen(chatPanel.hidden));
  chatPanel.querySelector('[data-chat-close]').addEventListener('click', () => {
    setOpen(false);
    chatToggle.focus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !chatPanel.hidden) {
      setOpen(false);
      chatToggle.focus();
    }
  });

  // Los mensajes se insertan como texto (nunca como HTML) para evitar inyección de código
  const addMessage = (text, who) => {
    const msg = document.createElement('p');
    msg.className = `chat-msg chat-msg--${who}`;
    msg.textContent = text;
    log.append(msg);
    log.scrollTop = log.scrollHeight;
    return msg;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    addMessage(text, 'user');
    history.push({ rol: 'user', texto: text });
    input.value = '';
    sendBtn.disabled = true;

    const reply = addMessage('Escribiendo…', 'bot');
    reply.classList.add('is-typing');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: history.slice(-MAX_HISTORY) }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.texto) throw new Error(json.error || 'No pude responder en este momento. Intenta de nuevo.');

      reply.textContent = json.texto;
      history.push({ rol: 'model', texto: json.texto });
    } catch (err) {
      reply.textContent =
        err instanceof TypeError
          ? 'No hay conexión con el asistente. Escríbenos por WhatsApp y te ayudamos.'
          : err.message;
      reply.classList.add('chat-msg--error');
      history.pop(); // la pregunta sin respuesta no se envía en el historial
    } finally {
      reply.classList.remove('is-typing');
      log.scrollTop = log.scrollHeight;
      sendBtn.disabled = false;
      input.focus();
    }
  });
}

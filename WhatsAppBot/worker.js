/**
 * Bot de WhatsApp de Soqual — Cloudflare Worker
 *
 * Qué hace:
 *  1. Recibe los mensajes que llegan al número de WhatsApp (webhook de la Cloud API de Meta).
 *  2. Clasifica cada mensaje con Gemini (con respaldo por palabras clave si Gemini falla).
 *  3. Si es una consulta de soporte o mantenimiento, responde con una guía básica fija.
 *  4. Si el cliente pide un asesor o describe un daño físico, le avisa que un técnico lo
 *     atenderá, avisa al equipo por Telegram y correo, y pausa el bot en ese chat.
 *  5. Si el mensaje es de otro tema (precios, cotizaciones, saludos…), NO responde:
 *     lo deja para que el equipo conteste manualmente desde la app de WhatsApp Business.
 *  6. Cuando alguien del equipo responde desde la app, el bot se pausa en ese chat
 *     para no interrumpir la conversación.
 *
 * Las respuestas son textos fijos (no texto libre generado por la IA): la IA solo
 * decide QUÉ guía enviar. Así el bot nunca inventa pasos ni promete cosas.
 *
 * Variables de entorno (Cloudflare → Worker → Settings → Variables and Secrets):
 *  VERIFY_TOKEN       Texto que tú inventas; debe coincidir con el que pones en Meta.
 *  APP_SECRET         "App secret" de tu app en Meta (para validar que el webhook es real).
 *  WHATSAPP_TOKEN     Token de acceso permanente (usuario del sistema) de la Cloud API.
 *  PHONE_NUMBER_ID    ID del número de teléfono en la Cloud API.
 *  GEMINI_API_KEY     Clave de Google AI Studio.
 *  TELEGRAM_BOT_TOKEN (opcional) Token del bot de Telegram que avisa al equipo.
 *  TELEGRAM_CHAT_ID   (opcional) Chat de Telegram donde llegan los avisos.
 *  RESEND_API_KEY     (opcional) Clave de Resend para avisar por correo.
 *  EMAIL_TO           (opcional) Correo que recibe los avisos.
 *  EMAIL_FROM         (opcional) Remitente. Por defecto "Bot Soqual <onboarding@resend.dev>".
 *  GEMINI_MODEL       (opcional) Modelo de Gemini. Por defecto "gemini-2.5-flash".
 *  GRAPH_VERSION      (opcional) Versión de la Graph API. Por defecto "v23.0".
 *  PAUSA_HORAS        (opcional) Horas que el bot se calla tras intervenir una persona. Por defecto 12.
 *  ESPERA_GUIA_HORAS  (opcional) Horas antes de reenviar la misma guía a un cliente. Por defecto 24.
 *
 * Enlace de KV (Settings → Bindings → KV namespace):
 *  ESTADO             Guarda las pausas y las guías ya enviadas. Sin él, el bot funciona
 *                     pero no se pausa ni evita repetir guías.
 */

// ---------------------------------------------------------------------------
// Textos de respuesta (edítalos aquí). WhatsApp usa *negrita* y _cursiva_.
// ---------------------------------------------------------------------------
const PIE =
  "\n\nSi el problema continúa, escribe *ASESOR* y un técnico de Soqual te atiende.";

const GUIAS = {
  cache_cookies:
    "🧹 *Cómo borrar caché y cookies del navegador*\n\n" +
    "⚠️ Borrar cookies cierra tus sesiones (correo, bancos, redes). Ten tus contraseñas a mano.\n\n" +
    "*Google Chrome*\n" +
    "1. Presiona *Ctrl + Shift + Supr*.\n" +
    "2. En *Intervalo de tiempo* elige *Desde siempre*.\n" +
    "3. Marca *Cookies y otros datos de sitios* y *Archivos e imágenes almacenados en caché*.\n" +
    "4. Clic en *Borrar datos*.\n\n" +
    "*Microsoft Edge*\n" +
    "1. Presiona *Ctrl + Shift + Supr*.\n" +
    "2. En *Intervalo de tiempo* elige *Todo el tiempo*.\n" +
    "3. Marca *Cookies y otros datos del sitio* y *Imágenes y archivos almacenados en caché*.\n" +
    "4. Clic en *Borrar ahora*.\n\n" +
    "*Mozilla Firefox*\n" +
    "1. Presiona *Ctrl + Shift + Supr*.\n" +
    "2. Elige *Todo* como rango de tiempo.\n" +
    "3. Marca *Cookies* y *Caché* y confirma.\n\n" +
    "Al terminar, cierra y vuelve a abrir el navegador." +
    PIE,

  temporales:
    "🗂️ *Cómo borrar archivos temporales en Windows*\n\n" +
    "*Opción 1 – Configuración (recomendada)*\n" +
    "1. Abre *Configuración → Sistema → Almacenamiento*.\n" +
    "2. Entra a *Archivos temporales*.\n" +
    "3. Marca *Archivos temporales* y *Archivos temporales de Internet*.\n" +
    "4. Clic en *Quitar archivos*.\n\n" +
    "*Opción 2 – Carpeta %temp%*\n" +
    "1. Presiona *Windows + R*, escribe *%temp%* y presiona Enter.\n" +
    "2. Selecciona todo con *Ctrl + E* y presiona *Supr*.\n" +
    "3. Si algún archivo está en uso, elige *Omitir*. Es normal.\n\n" +
    "⚠️ No borres archivos de otras carpetas del sistema." +
    PIE,

  lentitud:
    "🐢 *Pasos básicos si tu computador está lento*\n\n" +
    "1. *Reinícialo* (no solo suspender). Muchos problemas se resuelven así.\n" +
    "2. Abre el *Administrador de tareas* (*Ctrl + Shift + Esc*) y revisa en *Procesos* qué consume más CPU o memoria. Cierra los programas que no uses.\n" +
    "3. En la pestaña *Aplicaciones de arranque* (en Windows 10 se llama *Inicio*), deshabilita lo que no necesites al encender.\n" +
    "4. Borra archivos temporales: *Configuración → Sistema → Almacenamiento → Archivos temporales*.\n" +
    "5. Verifica que tengas al menos un *15% de espacio libre* en el disco.\n" +
    "6. Instala las actualizaciones pendientes en *Configuración → Windows Update*.\n\n" +
    "Si escribes *CACHÉ* te enviamos cómo limpiar el navegador." +
    PIE,

  general:
    "🔧 *Soporte técnico Soqual*\n\n" +
    "Te podemos enviar una guía básica. Responde con la palabra del tema:\n\n" +
    "• *CACHÉ* – borrar caché y cookies del navegador\n" +
    "• *TEMPORALES* – borrar archivos temporales de Windows\n" +
    "• *LENTO* – el computador está lento\n" +
    "• *ASESOR* – hablar con un técnico\n\n" +
    "También puedes contarnos con tus palabras qué le pasa a tu equipo.",

  asesor:
    "👨‍🔧 Listo. Un técnico de Soqual revisará tu caso y te escribirá por este chat.\n\n" +
    "Horario: lunes a viernes 7:00 a. m. – 5:00 p. m., sábados 9:00 a. m. – 2:00 p. m. " +
    "Para emergencias técnicas atendemos 24/7.",
};

const TEMAS_VALIDOS = ["cache_cookies", "temporales", "lentitud", "general", "asesor", "otro"];

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1) Verificación del webhook (Meta la hace una vez al configurarlo)
    if (request.method === "GET") {
      const ok =
        url.searchParams.get("hub.mode") === "subscribe" &&
        url.searchParams.get("hub.verify_token") === env.VERIFY_TOKEN;
      return ok
        ? new Response(url.searchParams.get("hub.challenge"), { status: 200 })
        : new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    // 2) Validar que la petición viene de Meta (firma HMAC con el App Secret)
    const raw = await request.text();
    const firma = request.headers.get("x-hub-signature-256") || "";
    if (!(await firmaValida(raw, firma, env.APP_SECRET))) {
      return new Response("Invalid signature", { status: 401 });
    }

    // 3) Responder 200 de inmediato y procesar en segundo plano
    //    (si Meta no recibe 200 rápido, reintenta y el cliente recibiría mensajes repetidos)
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return new Response("Bad Request", { status: 400 });
    }
    ctx.waitUntil(procesar(body, env));
    return new Response("OK", { status: 200 });
  },
};

async function procesar(body, env) {
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      // Mensajes que el equipo envía desde la app (coexistencia): pausan el bot en ese chat
      if (change.field === "smb_message_echoes") {
        for (const eco of change.value?.message_echoes || []) {
          try {
            await registrarRespuestaHumana(eco, env);
          } catch (err) {
            console.error("Error procesando eco", eco.id, err);
          }
        }
        continue;
      }

      // Solo mensajes entrantes. Se ignoran los estados de entrega.
      if (change.field !== "messages") continue;
      const contactos = change.value?.contacts || [];
      for (const msg of change.value?.messages || []) {
        if (msg.type !== "text") continue; // audios, fotos, etc. → los atiende una persona
        const texto = (msg.text?.body || "").trim();
        if (!texto) continue;
        const nombre = contactos.find((c) => c.wa_id === msg.from)?.profile?.name || "";

        try {
          await atenderMensaje({ numero: msg.from, nombre, texto }, env);
        } catch (err) {
          console.error("Error procesando mensaje", msg.id, err);
        }
      }
    }
  }
}

async function atenderMensaje({ numero, nombre, texto }, env) {
  // Si una persona del equipo ya está atendiendo este chat, el bot no interviene
  if (await estaPausado(numero, env)) return;

  const tema = await clasificar(texto, env);
  if (tema === "otro") return; // ventas, cotizaciones, saludos… → humano

  if (tema === "asesor") {
    // Se pausa primero: si Meta reenvía el mismo mensaje, ya no se repite nada
    await pausar(numero, env);
    await enviarTexto(numero, GUIAS.asesor, env);
    await avisarEquipo({ numero, nombre, texto }, env);
    return;
  }

  // La misma guía no se repite al mismo cliente dentro de ESPERA_GUIA_HORAS.
  // Esto también evita duplicados cuando Meta reenvía un webhook.
  if (!(await marcarGuiaEnviada(numero, tema, env))) return;
  await enviarTexto(numero, GUIAS[tema], env);
}

// ---------------------------------------------------------------------------
// Estado en KV (pausas y guías enviadas)
// ---------------------------------------------------------------------------
const HORA = 3600;

function horas(valor, porDefecto) {
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}

function soloDigitos(numero) {
  return String(numero || "").replace(/\D/g, "");
}

async function estaPausado(numero, env) {
  if (!env.ESTADO) return false;
  return (await env.ESTADO.get(`pausa:${soloDigitos(numero)}`)) !== null;
}

async function pausar(numero, env) {
  if (!env.ESTADO) return;
  const segundos = horas(env.PAUSA_HORAS, 12) * HORA;
  const clave = `pausa:${soloDigitos(numero)}`;

  // Cada mensaje del equipo extiende la pausa, pero solo se escribe en KV si ya pasó
  // la mitad del tiempo (el plan gratuito permite 1.000 escrituras al día).
  const { value, metadata } = await env.ESTADO.getWithMetadata(clave);
  if (value !== null && metadata?.hasta && metadata.hasta - Date.now() > (segundos * 1000) / 2) return;

  await env.ESTADO.put(clave, "1", {
    expirationTtl: segundos,
    metadata: { hasta: Date.now() + segundos * 1000 },
  });
}

async function marcarGuiaEnviada(numero, tema, env) {
  if (!env.ESTADO) return true;
  const clave = `guia:${soloDigitos(numero)}:${tema}`;
  if ((await env.ESTADO.get(clave)) !== null) return false;
  await env.ESTADO.put(clave, "1", { expirationTtl: horas(env.ESPERA_GUIA_HORAS, 24) * HORA });
  return true;
}

async function registrarRespuestaHumana(eco, env) {
  if (!env.ESTADO || !eco?.to) return;
  // Por seguridad se ignoran los mensajes que envió el propio bot, por si Meta
  // también los reportara como eco: si no, el bot se pausaría a sí mismo.
  if (eco.id && (await env.ESTADO.get(`enviado:${eco.id}`)) !== null) return;
  await pausar(eco.to, env);
}

// ---------------------------------------------------------------------------
// Clasificación
// ---------------------------------------------------------------------------
async function clasificar(texto, env) {
  // Las palabras exactas del menú no necesitan IA
  const directo = porPalabraClave(texto, true);
  if (directo) return directo;

  try {
    const tema = await clasificarConGemini(texto, env);
    if (TEMAS_VALIDOS.includes(tema)) return tema;
  } catch (err) {
    console.warn("Gemini no respondió, se usa el respaldo por palabras clave", err);
  }
  return porPalabraClave(texto, false) || "otro";
}

function normalizar(t) {
  return t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function porPalabraClave(texto, soloExacto) {
  const t = normalizar(texto);
  const exactos = {
    cache: "cache_cookies",
    cookies: "cache_cookies",
    temporales: "temporales",
    lento: "lentitud",
    lenta: "lentitud",
    asesor: "asesor",
    soporte: "general",
    menu: "general",
  };
  const palabra = t.replace(/[^a-z]/g, "");
  if (exactos[palabra]) return exactos[palabra];
  if (soloExacto) return null;

  // Pide una persona o describe un daño físico
  if (
    /\b(asesor|asesora|humano)\b|hablar con|un tecnico|una persona|me llamen|llamenme|me pueden llamar/.test(t) ||
    /no prende|no enciende|se moj|se (me )?cayo|pantalla (rota|partida|quebrada)|huele a quemado|sale humo/.test(t)
  )
    return "asesor";
  if (/\b(cache|cookies?|navegador|chrome|edge|firefox|historial)\b/.test(t)) return "cache_cookies";
  if (/temporal|%temp%|espacio en (el )?disco|disco lleno|sin espacio/.test(t)) return "temporales";
  if (/\b(lent[oa]|lentitud)\b|se pega|se congela|se traba|tarda mucho/.test(t)) return "lentitud";
  if (/\b(computador|computadora|portatil|pc|equipo|mantenimiento|virus|falla|error|windows)\b/.test(t))
    return "general";
  return null;
}

async function clasificarConGemini(texto, env) {
  const modelo = env.GEMINI_MODEL || "gemini-2.5-flash";
  const prompt = `Eres el clasificador de mensajes de WhatsApp de Soqual, una empresa de soporte técnico en Colombia.
Clasifica el mensaje del cliente en UNA de estas categorías:
- "cache_cookies": problemas con el navegador, páginas que no cargan bien, pide borrar caché, cookies o historial.
- "temporales": falta de espacio, quiere limpiar archivos temporales o basura del computador.
- "lentitud": el computador está lento, se congela o se demora.
- "general": cualquier otra consulta de soporte técnico o mantenimiento de computadores sin un tema claro de los anteriores.
- "asesor": pide hablar con una persona o técnico, o describe un daño físico (no enciende, se cayó, se mojó, pantalla rota).
- "otro": saludos, precios, cotizaciones, horarios, cámaras, páginas web o cualquier tema que no sea soporte de computadores.

Mensaje: """${texto.slice(0, 1000)}"""`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 50,
          // Sin "razonamiento": en Gemini 2.5 Flash el razonamiento consume el límite de
          // tokens de salida y la respuesta llegaría vacía.
          thinkingConfig: { thinkingBudget: 0 },
          // Gemini solo puede responder una de las categorías válidas
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: { categoria: { type: "STRING", enum: TEMAS_VALIDOS } },
            required: ["categoria"],
          },
        },
      }),
      signal: AbortSignal.timeout(8000),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const salida = data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
  return JSON.parse(salida.replace(/```json|```/g, "").trim()).categoria;
}

// ---------------------------------------------------------------------------
// WhatsApp Cloud API
// ---------------------------------------------------------------------------
async function enviarTexto(para, cuerpo, env) {
  const version = env.GRAPH_VERSION || "v23.0";
  const res = await fetch(`https://graph.facebook.com/${version}/${env.PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: para,
      type: "text",
      text: { body: cuerpo, preview_url: false },
    }),
  });
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);

  // Se guarda el id del mensaje enviado para no confundirlo con una respuesta del equipo
  const id = (await res.json().catch(() => null))?.messages?.[0]?.id;
  if (id && env.ESTADO) await env.ESTADO.put(`enviado:${id}`, "1", { expirationTtl: 24 * HORA });
}

// ---------------------------------------------------------------------------
// Avisos al equipo (Telegram y correo)
// ---------------------------------------------------------------------------
async function avisarEquipo({ numero, nombre, texto }, env) {
  const cliente = nombre ? `${nombre} (+${numero})` : `+${numero}`;
  const aviso =
    `Un cliente pidió atención de un técnico por WhatsApp.\n\n` +
    `Cliente: ${cliente}\n` +
    `Mensaje: ${texto.slice(0, 500)}\n\n` +
    `Responder: https://wa.me/${soloDigitos(numero)}\n\n` +
    `El bot quedó en pausa en este chat.`;

  const envios = [];
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    envios.push(
      enviarAviso("Telegram", `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        headers: { "Content-Type": "application/json" },
        body: { chat_id: env.TELEGRAM_CHAT_ID, text: `🔔 ${aviso}`, disable_web_page_preview: true },
      })
    );
  }
  if (env.RESEND_API_KEY && env.EMAIL_TO) {
    envios.push(
      enviarAviso("Correo", "https://api.resend.com/emails", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY}` },
        body: {
          from: env.EMAIL_FROM || "Bot Soqual <onboarding@resend.dev>",
          to: env.EMAIL_TO.split(",").map((c) => c.trim()),
          subject: `Soqual: ${cliente} pidió un técnico`,
          text: aviso,
        },
      })
    );
  }
  if (!envios.length) console.warn("No hay Telegram ni correo configurados para avisar al equipo");

  // Si un canal falla, el otro igual se envía
  for (const r of await Promise.allSettled(envios)) {
    if (r.status === "rejected") console.error("No se pudo avisar al equipo", r.reason);
  }
}

async function enviarAviso(canal, url, { headers, body }) {
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${canal} ${res.status}: ${await res.text()}`);
}

async function firmaValida(cuerpo, firma, secreto) {
  if (!secreto || !firma.startsWith("sha256=")) return false;
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(cuerpo));
  const esperado =
    "sha256=" + [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  // Comparación en tiempo constante
  if (esperado.length !== firma.length) return false;
  let diff = 0;
  for (let i = 0; i < esperado.length; i++) diff |= esperado.charCodeAt(i) ^ firma.charCodeAt(i);
  return diff === 0;
}

// Exportado solo para pruebas locales
export { clasificar, porPalabraClave, firmaValida, procesar, GUIAS };

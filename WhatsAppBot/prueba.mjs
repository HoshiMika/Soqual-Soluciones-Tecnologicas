// Pruebas locales del bot (no llaman a Meta, Gemini, Telegram ni Resend: todo es simulado).
// Ejecutar desde esta carpeta con:  node prueba.mjs
import assert from "node:assert/strict";
import worker, { porPalabraClave, procesar, GUIAS } from "./worker.js";

// ---------- Simulaciones ----------
function kvFalso() {
  const datos = new Map();
  return {
    datos,
    async get(k) {
      return datos.get(k)?.value ?? null;
    },
    async getWithMetadata(k) {
      const d = datos.get(k);
      return { value: d?.value ?? null, metadata: d?.metadata ?? null };
    },
    async put(k, value, opciones = {}) {
      datos.set(k, { value, metadata: opciones.metadata });
    },
  };
}

let llamadas = [];
let geminiResponde = (texto) => "otro";
let geminiCaido = false;
let idEnviado = 0;

globalThis.fetch = async (url, opciones) => {
  const body = JSON.parse(opciones.body);
  llamadas.push({ url, body });
  if (url.includes("generativelanguage")) {
    if (geminiCaido) return new Response("caído", { status: 503 });
    const texto = body.contents[0].parts[0].text.split('"""')[1];
    return Response.json({
      candidates: [{ content: { parts: [{ text: JSON.stringify({ categoria: geminiResponde(texto) }) }] } }],
    });
  }
  if (url.includes("graph.facebook.com")) return Response.json({ messages: [{ id: `wamid.bot${++idEnviado}` }] });
  return Response.json({ ok: true });
};

const env = () => ({
  ESTADO: kvFalso(),
  PHONE_NUMBER_ID: "123",
  WHATSAPP_TOKEN: "t",
  GEMINI_API_KEY: "g",
  TELEGRAM_BOT_TOKEN: "tg",
  TELEGRAM_CHAT_ID: "99",
  RESEND_API_KEY: "re",
  EMAIL_TO: "equipo@ejemplo.com",
});

const mensaje = (texto, from = "573001112233", id = `wamid.${Math.random()}`) => ({
  entry: [
    {
      changes: [
        {
          field: "messages",
          value: {
            contacts: [{ wa_id: from, profile: { name: "Ana" } }],
            messages: [{ from, id, type: "text", text: { body: texto } }],
          },
        },
      ],
    },
  ],
});

const eco = (to, id = "wamid.app1") => ({
  entry: [{ changes: [{ field: "smb_message_echoes", value: { message_echoes: [{ to, id, type: "text" }] } }] }],
});

const enviados = () => llamadas.filter((l) => l.url.includes("graph.facebook.com")).map((l) => l.body.text.body);
const avisos = () => llamadas.filter((l) => l.url.includes("telegram") || l.url.includes("resend"));

let ok = 0;
async function prueba(nombre, fn) {
  llamadas = [];
  geminiResponde = () => "otro";
  geminiCaido = false;
  await fn();
  ok++;
  console.log("✔", nombre);
}

// ---------- Palabras clave ----------
await prueba("palabras exactas del menú", () => {
  assert.equal(porPalabraClave("CACHÉ", true), "cache_cookies");
  assert.equal(porPalabraClave("Lento!", true), "lentitud");
  assert.equal(porPalabraClave("asesor", true), "asesor");
  assert.equal(porPalabraClave("SOPORTE", true), "general");
  assert.equal(porPalabraClave("mi pc está lento", true), null);
});

await prueba("respaldo por palabras clave sin falsos positivos", () => {
  assert.equal(porPalabraClave("necesito soporte técnico para mi pc", false), "general");
  assert.equal(porPalabraClave("necesito un técnico", false), "asesor");
  assert.equal(porPalabraClave("¿cuánto se demora el servicio?", false), null);
  assert.equal(porPalabraClave("mi portátil no prende", false), "asesor");
  assert.equal(porPalabraClave("chrome no carga las páginas", false), "cache_cookies");
  assert.equal(porPalabraClave("el computador se congela", false), "lentitud");
  assert.equal(porPalabraClave("tengo el disco lleno", false), "temporales");
  assert.equal(porPalabraClave("cuánto cuesta una página web", false), null);
});

// ---------- Flujo completo ----------
await prueba("Gemini clasifica y se envía la guía", async () => {
  const e = env();
  geminiResponde = () => "lentitud";
  await procesar(mensaje("mi equipo anda fatal"), e);
  assert.deepEqual(enviados(), [GUIAS.lentitud]);
  const pedido = llamadas.find((l) => l.url.includes("generativelanguage")).body.generationConfig;
  assert.equal(pedido.thinkingConfig.thinkingBudget, 0);
  assert.deepEqual(pedido.responseSchema.properties.categoria.enum.length, 6);
});

await prueba("con Gemini caído se usa el respaldo", async () => {
  geminiCaido = true;
  const avisos = console.warn;
  console.warn = () => {};
  await procesar(mensaje("chrome no abre bien las páginas"), env());
  console.warn = avisos;
  assert.deepEqual(enviados(), [GUIAS.cache_cookies]);
});

await prueba("temas de venta no se responden", async () => {
  await procesar(mensaje("cuánto vale instalar cámaras"), env());
  assert.equal(enviados().length, 0);
});

await prueba("la misma guía no se repite (ni si Meta reenvía el webhook)", async () => {
  const e = env();
  const m = mensaje("CACHE", "573001112233", "wamid.repetido");
  await procesar(m, e);
  await procesar(m, e); // reenvío de Meta
  await procesar(mensaje("cookies"), e); // el cliente la pide otra vez
  assert.equal(enviados().length, 1);
  await procesar(mensaje("lento"), e); // otra guía sí se envía
  assert.equal(enviados().length, 2);
});

await prueba("ASESOR: avisa al cliente, al equipo y pausa el bot", async () => {
  const e = env();
  await procesar(mensaje("ASESOR"), e);
  assert.deepEqual(enviados(), [GUIAS.asesor]);
  assert.equal(avisos().length, 2);
  const tg = avisos().find((l) => l.url.includes("telegram")).body.text;
  assert.match(tg, /Ana \(\+573001112233\)/);
  assert.match(tg, /wa\.me\/573001112233/);
  await procesar(mensaje("lento"), e); // en pausa: no responde
  assert.equal(enviados().length, 1);
});

await prueba("si el equipo responde desde la app, el bot se calla", async () => {
  const e = env();
  await procesar(eco("573001112233"), e);
  await procesar(mensaje("CACHE"), e);
  assert.equal(enviados().length, 0);
  await procesar(mensaje("CACHE", "573009998877"), e); // otro cliente sí recibe respuesta
  assert.equal(enviados().length, 1);
});

await prueba("los mensajes del propio bot no lo pausan", async () => {
  const e = env();
  await procesar(mensaje("lento"), e); // el bot envía wamid.botN
  await procesar(eco("573001112233", `wamid.bot${idEnviado}`), e);
  await procesar(mensaje("CACHE"), e);
  assert.equal(enviados().length, 2);
});

await prueba("si falla Telegram, el correo igual se envía", async () => {
  geminiResponde = () => "asesor";
  const original = globalThis.fetch;
  globalThis.fetch = async (url, op) =>
    url.includes("telegram") ? new Response("error", { status: 500 }) : original(url, op);
  const errores = console.error;
  console.error = () => {};
  await procesar(mensaje("quiero hablar con una persona"), env());
  console.error = errores;
  globalThis.fetch = original;
  assert.equal(llamadas.filter((l) => l.url.includes("resend")).length, 1);
});

await prueba("sin KV el bot sigue funcionando", async () => {
  const e = env();
  delete e.ESTADO;
  await procesar(mensaje("ASESOR"), e);
  await procesar(mensaje("CACHE"), e);
  assert.equal(enviados().length, 2);
});

await prueba("audios y fotos no se procesan", async () => {
  const m = mensaje("x");
  m.entry[0].changes[0].value.messages[0] = { from: "57300", id: "a", type: "audio" };
  await procesar(m, env());
  assert.equal(llamadas.length, 0);
});

// ---------- Webhook ----------
await prueba("verificación del webhook y firma", async () => {
  const e = { ...env(), VERIFY_TOKEN: "frase", APP_SECRET: "secreto" };
  const ctx = { waitUntil: () => {} };
  let r = await worker.fetch(new Request("https://x/?hub.mode=subscribe&hub.verify_token=frase&hub.challenge=42"), e, ctx);
  assert.equal(await r.text(), "42");
  r = await worker.fetch(new Request("https://x/?hub.mode=subscribe&hub.verify_token=mal&hub.challenge=42"), e, ctx);
  assert.equal(r.status, 403);

  const cuerpo = JSON.stringify(mensaje("hola"));
  r = await worker.fetch(
    new Request("https://x/", { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": "sha256=falsa" } }),
    e,
    ctx
  );
  assert.equal(r.status, 401);

  const { createHmac } = await import("node:crypto");
  const firma = "sha256=" + createHmac("sha256", "secreto").update(cuerpo).digest("hex");
  r = await worker.fetch(
    new Request("https://x/", { method: "POST", body: cuerpo, headers: { "x-hub-signature-256": firma } }),
    e,
    ctx
  );
  assert.equal(r.status, 200);
});

console.log(`\n${ok} pruebas superadas`);

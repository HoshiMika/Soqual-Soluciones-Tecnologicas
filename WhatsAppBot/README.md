# Bot de soporte por WhatsApp — Soqual

El bot lee los mensajes que llegan al WhatsApp de Soqual, detecta si son de soporte o mantenimiento y responde con una guía básica: borrar caché y cookies, borrar archivos temporales o qué hacer si el computador está lento. Los demás mensajes (precios, cotizaciones, cámaras, páginas web, saludos) no los contesta: quedan para que el equipo los atienda desde la app.

## Cómo funciona

```
Cliente escribe ──► WhatsApp Cloud API ──► Worker (worker.js)
                                              │
                                ¿El chat está en pausa? ── sí ──► no responde
                                              │ no
                                   Gemini clasifica el mensaje
                                   (si falla: palabras clave)
                                              │
       ┌──────────────┬──────────────┬────────┴─────┬──────────────┬──────────────┐
  cache_cookies   temporales     lentitud        general         asesor          otro
       │              │              │              │              │              │
   guía fija      guía fija      guía fija        menú       aviso al cliente  no responde
                                                              + Telegram/correo  (humano)
                                                              + pausa el chat
```

- La IA solo **elige** qué guía enviar. Los textos son fijos y están al inicio de `worker.js`, en el objeto `GUIAS`, así que el bot no puede inventar pasos ni prometer precios.
- **Pausa de 12 horas:** cuando el cliente escribe *ASESOR* (o describe un daño físico) o cuando alguien del equipo le responde desde la app, el bot deja de responder en ese chat. Así no interrumpe al técnico.
- **Sin repeticiones:** el bot no envía la misma guía al mismo cliente más de una vez cada 24 horas. Esto también evita duplicados cuando Meta reenvía un mensaje.
- **Aviso al equipo:** cuando un cliente pide un técnico, llega un mensaje por Telegram y un correo con el nombre, el número, lo que escribió y un enlace para responderle.

Los tiempos se cambian con las variables `PAUSA_HORAS` y `ESPERA_GUIA_HORAS`.

## Lo que vas a necesitar

| Qué | Para qué | Costo |
| --- | --- | --- |
| App de WhatsApp Business actualizada | El número de Soqual | Gratis |
| Cuenta de Cloudflare | Alojar el bot | Plan gratuito |
| Cuenta de Meta (Facebook) | Conectar el número a la API | Gratis; ver *Costos* |
| Google AI Studio | Clave de Gemini | Capa gratuita |
| Telegram | Avisos al equipo | Gratis |
| Resend | Avisos por correo | Plan gratuito |

> **Nunca pegues claves ni tokens en el código, en GitHub ni en un chat.** Todos van como *Secret* en Cloudflare (paso 6).

## Instalación paso a paso

### 1. Clave de Gemini
1. Entra a [Google AI Studio](https://aistudio.google.com/app/apikey) con la cuenta de Soqual.
2. Si existe la clave vieja del chatbot de la página, **elimínala**.
3. Crea una clave nueva y guárdala para el paso 6 (`GEMINI_API_KEY`).

### 2. Bot de Telegram para los avisos
1. En Telegram, busca **@BotFather**, escríbele `/newbot` y sigue las instrucciones. Al final te da un token (`TELEGRAM_BOT_TOKEN`).
2. Abre el chat con tu bot nuevo y escríbele cualquier cosa (por ejemplo, "hola").
   - Para que los avisos lleguen a todo el equipo, crea un grupo, agrega al bot y escribe un mensaje en el grupo.
3. En el navegador abre `https://api.telegram.org/botTU_TOKEN/getUpdates` (cambia `TU_TOKEN`). Busca `"chat":{"id":...}`: ese número es `TELEGRAM_CHAT_ID`. En los grupos empieza con `-`.

### 3. Resend para los avisos por correo
1. Crea una cuenta en [resend.com](https://resend.com) con el correo que va a recibir los avisos.
2. Ve a **API Keys → Create API Key** (permiso *Sending access*) y guárdala (`RESEND_API_KEY`).
3. `EMAIL_TO` es ese mismo correo.

Sin dominio propio, Resend solo deja enviar al correo con el que creaste la cuenta, y el remitente es `onboarding@resend.dev`. Si más adelante verificas un dominio en Resend, puedes enviar a varios correos (sepáralos con coma en `EMAIL_TO`) y cambiar el remitente con `EMAIL_FROM`.

### 4. Cloudflare: Worker y almacenamiento
1. En Cloudflare, ve a **Workers & Pages → Create → Worker**, ponle el nombre `soqual-whatsapp-bot` y despliégalo.
2. Abre **Edit code**, reemplaza todo el contenido por `worker.js` y despliega.
3. Ve a **Storage & Databases → KV → Create** y crea un espacio llamado `soqual-bot-estado`.
4. Vuelve al Worker → **Settings → Bindings → Add → KV namespace**. En *Variable name* escribe `ESTADO` y elige `soqual-bot-estado`.
5. Copia la URL del Worker (por ejemplo `https://soqual-whatsapp-bot.TU-USUARIO.workers.dev`). La usarás en el paso 5.

### 5. Meta: conectar el número
1. Entra a [Meta for Developers](https://developers.facebook.com) con tu cuenta de Facebook y crea una app de tipo **Empresa** (*Business*), vinculada al portafolio comercial de Soqual (si no tienes uno, Meta te ofrece crearlo).
2. Agrega el producto **WhatsApp**.
3. Agrega el número de Soqual eligiendo la opción de conectar un número que **ya usas en la app de WhatsApp Business** (coexistencia). Meta te mostrará un código QR que debes escanear desde la app, en el celular.
   - Si esa opción no aparece en tu panel, la coexistencia se activa mediante un proveedor de WhatsApp (BSP) que la ofrezca. **No** registres el número de la forma normal: eso lo sacaría de la app.
4. En **WhatsApp → Configuración de la API** copia el identificador del número (`PHONE_NUMBER_ID`).
5. En **Configuración de la app → Básica** copia la clave secreta (`APP_SECRET`).
6. Crea el token permanente:
   1. En [business.facebook.com](https://business.facebook.com) ve a **Configuración → Usuarios → Usuarios del sistema → Agregar** (rol administrador).
   2. Asígnale la app y la cuenta de WhatsApp.
   3. Clic en **Generar token**, elige la app y marca `whatsapp_business_messaging` y `whatsapp_business_management`. Ese es `WHATSAPP_TOKEN`.

### 6. Guardar los secretos en Cloudflare
En el Worker → **Settings → Variables and Secrets → Add**, agrega cada uno como tipo **Secret**:

| Variable | Valor |
| --- | --- |
| `VERIFY_TOKEN` | Una frase larga sin espacios que inventes tú |
| `APP_SECRET` | Paso 5.5 |
| `WHATSAPP_TOKEN` | Paso 5.6 |
| `PHONE_NUMBER_ID` | Paso 5.4 |
| `GEMINI_API_KEY` | Paso 1 |
| `TELEGRAM_BOT_TOKEN` | Paso 2.1 |
| `TELEGRAM_CHAT_ID` | Paso 2.3 |
| `RESEND_API_KEY` | Paso 3.2 |
| `EMAIL_TO` | Paso 3.3 |

Opcionales (tipo *Text*): `PAUSA_HORAS` (12), `ESPERA_GUIA_HORAS` (24), `GEMINI_MODEL` (`gemini-2.5-flash`) y `GRAPH_VERSION` (`v23.0`). Verifica en la documentación de Meta y de Google que la versión de la Graph API y el modelo de Gemini sigan vigentes.

### 7. Conectar el webhook
1. En Meta, ve a **WhatsApp → Configuración → Webhook → Editar**.
2. **URL de devolución de llamada:** la URL del Worker (paso 4.5).
3. **Token de verificación:** el mismo valor de `VERIFY_TOKEN`.
4. Suscríbete a los campos **messages** y **smb_message_echoes**. El segundo es el que avisa al bot que el equipo respondió desde la app.

### 8. Probar
Desde otro celular, escribe al número de Soqual:

| Mensaje | Resultado esperado |
| --- | --- |
| `CACHÉ` | Guía de caché y cookies |
| `mi computador está muy lento` | Guía de lentitud |
| `CACHÉ` otra vez | No responde (ya la envió hoy) |
| `cuánto cuesta una página web` | No responde (lo atiende una persona) |
| `mi portátil no prende` | Aviso de que un técnico lo atenderá + Telegram + correo |
| `TEMPORALES` | No responde (el chat quedó en pausa 12 horas) |

Para repetir las pruebas sin esperar, borra las claves del número de prueba en **KV → soqual-bot-estado**.

Si algo falla, abre **Workers → soqual-whatsapp-bot → Logs** para ver el error.

## Saludo automático de la app

Con la coexistencia activa, el saludo automático de la app de WhatsApp Business puede seguir funcionando. Cámbialo por este texto, que además informa sobre el uso de un asistente automático:

> ¡Hola! Bienvenido a Soqual Soluciones Tecnológicas. Cuéntanos qué necesitas.
> Si es un problema con tu computador, escribe *SOPORTE* y te enviamos una guía rápida.
> _Usamos un asistente automático para clasificar tu consulta. Si prefieres hablar con una persona, escribe ASESOR._

## Mientras activas la API: respuestas rápidas

La app de WhatsApp Business no puede leer ni analizar los mensajes por sí sola. Mientras configuras lo anterior, puedes crear **respuestas rápidas** en **Herramientas para la empresa → Respuestas rápidas** con los textos del objeto `GUIAS`:

| Atajo | Contenido |
| --- | --- |
| `/cache` | Guía de caché y cookies |
| `/temporales` | Guía de archivos temporales |
| `/lento` | Guía de lentitud |

## Pruebas locales

Con Node.js 18 o superior, desde esta carpeta:

```
node prueba.mjs
```

Las pruebas simulan Meta, Gemini, Telegram, Resend y el almacenamiento: no envían nada real.

## Consideraciones

- **Costos.** Las respuestas del bot dentro de las 24 horas siguientes al mensaje del cliente son mensajes de servicio y Meta no las cobra. Solo se pagan las plantillas que se envíen fuera de esa ventana, y este bot no las usa. Revisa la tarifa vigente de Meta para Colombia por si cambia.
- **Límites gratuitos.** El plan gratuito de Cloudflare permite 1.000 escrituras al día en KV; el bot hace unas dos por cada guía enviada, así que alcanza para cerca de 400 respuestas diarias. La capa gratuita de Gemini tiene un límite de solicitudes por minuto; si se supera, el bot usa las palabras clave.
- **Privacidad.** El texto de los mensajes se envía a Google para clasificarlo (no el número ni el nombre). En la capa gratuita de Gemini, Google puede usar esos datos para mejorar sus productos. Por la Ley 1581 de 2012, informa a los clientes (el saludo de arriba lo hace) e incluye este uso en la política de tratamiento de datos de Soqual. Si el volumen crece, la capa de pago de Gemini no usa los datos para entrenar.
- **Políticas de Meta.** WhatsApp permite bots de atención al cliente enfocados en el negocio, como este. No permite asistentes de IA de propósito general. Por eso el bot solo responde temas de soporte y deja el resto a una persona.
- **Mensajes que no son texto.** Las notas de voz, fotos y documentos no se procesan: los atiende el equipo.

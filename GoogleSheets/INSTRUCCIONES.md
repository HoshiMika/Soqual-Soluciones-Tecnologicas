# Cómo activar tu base de datos gratuita (Google Sheets)

Con esto, cada vez que un cliente llene el formulario de "Contacto", sus
datos quedarán guardados como una fila nueva en una hoja de cálculo que
tú controlas. No tiene límite de envíos y no requiere tarjeta ni pagos.

## Paso 1 — Crear la hoja de cálculo
1. Entra a https://sheets.google.com con tu cuenta de Google (la misma que
   usas para Gmail/Drive).
2. Crea una hoja de cálculo en blanco y ponle de nombre, por ejemplo,
   "Soportes SoqualST".

## Paso 2 — Pegar el script
1. En la hoja, ve al menú **Extensiones > Apps Script**.
2. Se abrirá un editor con un archivo `Code.gs` que tiene código de ejemplo.
   Bórralo todo.
3. Abre el archivo `GoogleSheets/Code.gs` de este proyecto, copia todo su
   contenido y pégalo en el editor de Apps Script.
4. Guarda con el ícono del disquete (o Ctrl+S).

## Paso 3 — Publicar como aplicación web
1. Arriba a la derecha, haz clic en **Implementar > Nueva implementación**.
2. En "Seleccionar tipo", elige **Aplicación web** (ícono de engranaje).
3. Configura:
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
4. Haz clic en **Implementar**.
5. Google te pedirá autorizar permisos (es tu propio script, es seguro).
   Sigue el flujo: "Avanzado" > "Ir a [nombre del proyecto] (no seguro)"
   — este aviso aparece porque el script no está verificado por Google,
   pero como es tuyo y solo escribe en tu propia hoja, no hay riesgo.
6. Copia la **URL de la aplicación web** que te entrega al final. Se ve
   parecido a:
   `https://script.google.com/macros/s/AKfycb.../exec`

## Paso 4 — Conectar el formulario de la página
1. Abre el archivo `JS/JS_Contacto/Formulario.js` del proyecto.
2. Busca la línea:
   ```js
   const GOOGLE_SHEETS_URL = "PEGA_AQUI_LA_URL_DE_TU_APPS_SCRIPT";
   ```
3. Reemplaza el texto entre comillas por la URL que copiaste en el paso 3.
4. Guarda y sube el cambio a tu repositorio / hosting.

## Paso 5 — Probar
1. Abre tu página de Contacto y envía el formulario con datos de prueba.
2. Ve a tu hoja de cálculo: debería aparecer una fila nueva en la pestaña
   "Soportes" en segundos.

## Notas importantes
- Si en el futuro necesitas actualizar el código del script, tendrás que
  volver a "Implementar > Nueva implementación" o "Administrar
  implementaciones > Editar" para que los cambios queden activos.
- Puedes seguir recibiendo también el aviso por correo de Formspree; ambos
  envíos ocurren en paralelo y no dependen uno del otro.
- Esta hoja de cálculo es tu "base de datos": puedes ordenar, filtrar,
  exportar a Excel/CSV, o incluso conectar Google Data Studio/Looker
  Studio (gratis) más adelante si quieres gráficas de tus soportes.

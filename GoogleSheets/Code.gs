/**
 * Code.gs
 * -------
 * Este script recibe los datos del formulario de contacto de Soqual ST
 * y los guarda como una fila nueva en una Hoja de Cálculo de Google.
 * Es 100% gratuito y no tiene límite de envíos.
 *
 * INSTALACIÓN (ver INSTRUCCIONES.md para el paso a paso con capturas
 * conceptuales):
 *   1. Crea una hoja de cálculo nueva en https://sheets.google.com
 *   2. Extensiones > Apps Script
 *   3. Borra el contenido de Code.gs que aparece por defecto y pega
 *      TODO el contenido de este archivo.
 *   4. Guarda, y en "Implementar" > "Nueva implementación" elige tipo
 *      "Aplicación web". Ejecutar como "Yo", acceso "Cualquier usuario".
 *   5. Copia la URL que te entrega y pégala en Formulario.js, en la
 *      constante GOOGLE_SHEETS_URL.
 */

function doPost(e) {
  try {
    const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Soportes")
      || crearHojaConEncabezados();

    const datos = e.parameter;

    hoja.appendRow([
      datos.fecha || new Date().toLocaleString("es-CO"),
      datos.nombre || "",
      datos.email || "",
      datos.telefono || "",
      datos.asunto || "",
      datos.mensaje || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ resultado: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ resultado: "error", detalle: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function crearHojaConEncabezados() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.insertSheet("Soportes");
  hoja.appendRow(["Fecha", "Nombre", "Email", "Teléfono", "Asunto", "Mensaje"]);
  hoja.setFrozenRows(1);
  return hoja;
}

/**
 * Función de prueba: puedes ejecutarla manualmente desde el editor de
 * Apps Script (botón "Ejecutar") para comprobar que la hoja se crea bien,
 * sin necesidad de tener el formulario desplegado todavía.
 */
function pruebaManual() {
  const evento = {
    parameter: {
      fecha: new Date().toLocaleString("es-CO"),
      nombre: "Cliente de prueba",
      email: "prueba@correo.com",
      telefono: "3000000000",
      asunto: "Prueba del sistema",
      mensaje: "Este es un registro de prueba."
    }
  };
  doPost(evento);
}

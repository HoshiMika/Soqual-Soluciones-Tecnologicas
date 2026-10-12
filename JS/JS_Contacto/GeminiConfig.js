// Configuración de Gemini API - GeminiConfig.js
//
// ⚠️ IMPORTANTE - SEGURIDAD:
// La versión anterior de este archivo tenía la API Key escrita directamente
// aquí y quedó expuesta públicamente en GitHub. Si esa clave sigue activa,
// revócala YA en https://aistudio.google.com/app/apikey y genera una nueva.
//
// OJO: este archivo se descarga en el navegador de CUALQUIER visitante de tu
// página (basta con abrir las herramientas de desarrollador o "ver código
// fuente"), así que poner la clave real aquí NUNCA es seguro, sin importar
// si el repositorio de GitHub es público o privado. La única forma correcta
// de resolver esto de raíz es:
//   Mover las llamadas a Gemini a un backend propio o a una función
//   serverless (Vercel, Netlify o Cloudflare Workers tienen capa gratuita)
//   que guarde la clave como variable de entorno del servidor y sea ese
//   backend quien llame a Gemini, nunca el navegador directamente.
// Mientras implementas eso, como mínimo limita la clave en Google AI Studio
// (restricción por dominio/HTTP referrer) para que solo funcione desde tu
// dominio real, y vigila el consumo para detectar uso indebido.
const GEMINI_API_KEY = 'TU_API_KEY_AQUI';

// Configuración optimizada para Gemini 2.5/2.0
const GEMINI_CONFIG = {
    API_KEY: GEMINI_API_KEY,
    CONFIG: {
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
        }
    }
};

// Exportar para uso global
window.GEMINI_CONFIG = GEMINI_CONFIG;
console.log('✅ Gemini 2.5/2.0 Config loaded');
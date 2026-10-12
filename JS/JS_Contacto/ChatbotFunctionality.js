// Crear y agregar la interfaz completa del chatbot
const ChatbotFunctionality = document.createElement("div");

ChatbotFunctionality.innerHTML = `
<!-- Chatbot IA Completo -->
<div class="chatbot-ia" style="display: none;">
    <div class="chatbot-header">
        <div class="chatbot-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="chatbot-info">
            <h4>Asistente IA SoqualST</h4>
            <p>Conectado</p>
        </div>
        <button class="chatbot-close">
            <i class="fas fa-times"></i>
        </button>
    </div>
    
    <div class="chatbot-message">
        <p>¡Hola! Soy SoqualST AI 🤖</p>
        <p>Estoy aquí para ayudarte con cualquier pregunta que tengas.</p>
    </div>
    
    <div class="chatbot-conversation" id="chatbotConversation">
        <!-- Los mensajes aparecerán aquí -->
    </div>
    
    <div class="chatbot-input-container">
        <input type="text" id="chatbotInput" placeholder="Escribe tu pregunta aquí..." class="chatbot-input">
        <button id="chatbotSend" class="chatbot-send">
            <i class="fas fa-paper-plane"></i>
        </button>
    </div>
    
    <div class="chatbot-status" id="chatbotStatus">
        <i class="fas fa-circle" style="color: #28a745; font-size: 8px;"></i>
        <span>Conectado a SoqualST</span>
    </div>
</div>

`;

// Agregar la interfaz del chatbot al cuerpo
document.body.appendChild(ChatbotFunctionality);

// Funcionalidad del chatbot usando fetch directo a la API
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing chatbot with SoqualST...');
    
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    const chatbot = document.querySelector('.chatbot-ia');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotConversation = document.getElementById('chatbotConversation');
    const chatbotStatus = document.getElementById('chatbotStatus');
    
    let conversationHistory = [];
    
    // Configuración con modelos ACTUALES basado en tu diagnóstico
    const API_KEY = window.GEMINI_CONFIG?.API_KEY;
    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/';
    
    // Modelos DISPONIBLES según tu diagnóstico - ORDENADOS POR CALIDAD
    const AVAILABLE_MODELS = [
        'gemini-2.5-flash',      // Mejor modelo disponible
        'gemini-2.5-pro',        // Alternativa de alta calidad
        'gemini-2.0-flash',      // Modelo rápido
        'gemini-2.0-flash-001'   // Versión estable
    ];
    
    let currentModel = AVAILABLE_MODELS[0];
    
    // Verificar configuración
    function checkConfig() {
        if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
            showStatus('⚠️ Configura tu API Key en GeminiConfig.js', 'warning');
            console.error('API Key no configurada');
            return false;
        }
        return true;
    }
    
    // Abrir chatbot
    chatbotTrigger.addEventListener('click', function() {
        chatbot.style.display = 'block';
        setTimeout(() => chatbot.classList.add('active'), 10);
        chatbotInput.focus();
        
        if (!checkConfig()) {
            addMessage('Por favor, configura tu API Key de Gemini en el archivo GeminiConfig.js', 'ai');
        } else {
            showStatus(`Conectado a SoqualST`, 'success');
        }
    });
    
    // Cerrar chatbot
    chatbotClose.addEventListener('click', function() {
        chatbot.classList.remove('active');
        setTimeout(() => chatbot.style.display = 'none', 300);
    });
    
    // Enviar mensaje al hacer clic en el botón
    chatbotSend.addEventListener('click', function() {
        sendMessage();
    });
    
    // Enviar mensaje al presionar Enter
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Función para enviar mensaje usando fetch directo
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        
        if (message === '') return;
        
        if (!checkConfig()) {
            addMessage('Error: API Key no configurada. Verifica GeminiConfig.js', 'ai');
            return;
        }
        
        // Deshabilitar input mientras se procesa
        chatbotInput.disabled = true;
        chatbotSend.disabled = true;
        
        // Agregar mensaje del usuario
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Mostrar indicador de typing
        const typingIndicator = showTypingIndicator();
        
        try {
            // Construir el prompt
            const prompt = buildPrompt(message);
            
            // Intentar con el modelo actual, si falla probar otros
            let response = await trySendMessage(prompt, currentModel);
            
            if (!response.success) {
                // Probar otros modelos disponibles
                showStatus('Probando modelos alternativos...', 'warning');
                for (const model of AVAILABLE_MODELS) {
                    if (model !== currentModel) {
                        console.log(`🔄 Probando modelo alternativo: ${model}`);
                        response = await trySendMessage(prompt, model);
                        if (response.success) {
                            currentModel = model;
                            console.log(`✅ Modelo cambiado a: ${currentModel}`);
                            break;
                        }
                    }
                }
            }
            
            typingIndicator.remove();
            
            if (response.success) {
                addMessage(response.text, 'ai');
                showStatus(`Conectado a SoqualST`, 'success');
                updateConversationHistory(message, response.text);
            } else {
                throw new Error(response.error || 'Todos los modelos fallaron');
            }
            
        } catch (error) {
            typingIndicator.remove();
            console.error('❌ Error con Gemini API:', error);
            
            let errorMessage = 'Lo siento, hubo un error al procesar tu solicitud. ';
            
            if (error.message.includes('API_KEY') || error.message.includes('401')) {
                errorMessage += 'Error de autenticación. Verifica tu API Key.';
                showStatus('Error de API Key', 'error');
            } else if (error.message.includes('429')) {
                errorMessage += 'Límite de solicitudes excedido. Intenta más tarde.';
                showStatus('Límite excedido', 'warning');
            } else if (error.message.includes('404')) {
                errorMessage += 'Modelo no disponible. Contacta al administrador.';
                showStatus('Error de modelo', 'error');
            } else if (error.message.includes('Todos los modelos fallaron')) {
                errorMessage += 'No hay modelos disponibles. Verifica tu configuración.';
                showStatus('Sin modelos disponibles', 'error');
            } else {
                errorMessage += 'Error: ' + error.message;
                showStatus('Error de conexión', 'error');
            }
            
            addMessage(errorMessage, 'ai');
        }
        
        // Rehabilitar input
        chatbotInput.disabled = false;
        chatbotSend.disabled = false;
        chatbotInput.focus();
    }
    
    // Función para enviar mensaje a la API
    async function trySendMessage(prompt, modelName) {
        try {
            console.log(`📤 Enviando mensaje a ${modelName}...`);
            
            const response = await fetch(`${API_URL}${modelName}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1000,
                    }
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log(`❌ ${modelName}: ${errorData.error?.message || `HTTP ${response.status}`}`);
                return {
                    success: false,
                    error: errorData.error?.message || `HTTP ${response.status}`
                };
            }
            
            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;
            
            console.log(`✅ ${modelName}: Respuesta exitosa`);
            return {
                success: true,
                text: text
            };
            
        } catch (error) {
            console.log(`❌ ${modelName}: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Función para construir el prompt
    function buildPrompt(newMessage) {
        if (conversationHistory.length === 0) {
            return `Eres un asistente útil y amigable llamado SoqualST. Responde en español de manera clara y concisa.\n\nUsuario: ${newMessage}\n\nAsistente:`;
        }
        
        let history = "Historial de conversación:\n";
        conversationHistory.forEach(entry => {
            history += `${entry.role === 'user' ? 'Usuario' : 'Asistente'}: ${entry.content}\n`;
        });
        
        history += `\nUsuario: ${newMessage}\n\nAsistente:`;
        return history;
    }
    
    // Función para actualizar el historial
    function updateConversationHistory(userMessage, aiMessage) {
        conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        
        conversationHistory.push({
            role: 'assistant',
            content: aiMessage
        });
        
        // Limitar el historial a las últimas 6 interacciones
        if (conversationHistory.length > 12) {
            conversationHistory = conversationHistory.slice(-12);
        }
    }
    
    // Función para agregar mensaje al chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const formattedText = text.replace(/\n/g, '<br>');
        messageContent.innerHTML = formattedText;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = getCurrentTime();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        chatbotConversation.appendChild(messageDiv);
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    }
    
    // Función para mostrar indicador de typing
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p>SoqualST está pensando...</p>
        `;
        chatbotConversation.appendChild(typingIndicator);
        chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
        return typingIndicator;
    }
    
    // Función para mostrar estado de conexión
    function showStatus(message, type) {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-exclamation-circle'
        };
        
        chatbotStatus.innerHTML = `
            <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 12px;"></i>
            <span>${message}</span>
        `;
    }
    
    // Función para obtener hora actual
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' + 
               now.getMinutes().toString().padStart(2, '0');
    }
    
    // Cerrar al hacer clic fuera del chatbot
    document.addEventListener('click', function(event) {
        if (chatbot.classList.contains('active') && 
            !chatbot.contains(event.target) && 
            !chatbotTrigger.contains(event.target)) {
            chatbot.classList.remove('active');
            setTimeout(() => chatbot.style.display = 'none', 300);
        }
    });
    
    // Verificar configuración al cargar
    if (checkConfig()) {
        showStatus(`Conectado a SoqualST`, 'success');
        console.log('✅ Chatbot configurado como SoqualST');
    }
});
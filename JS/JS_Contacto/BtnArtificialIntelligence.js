// Crear y agregar el botón flotante del chatbot
const BtnArtificialIntelligence = document.createElement("div");

BtnArtificialIntelligence.innerHTML = `
<!-- Botón flotante del chatbot -->
<div class="chatbot-float" id="chatbotTrigger">
    <div class="chatbot-float-icon">
        <i class="fas fa-robot"></i>
    </div>
    <div class="chatbot-float-pulse"></div>
</div>
`;

// Agregar el botón al cuerpo del documento
document.body.appendChild(BtnArtificialIntelligence);
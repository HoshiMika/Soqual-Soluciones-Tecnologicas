// Espera que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // Inserta el HTML dentro del div con id="redessociales"
  document.getElementById("RedesSociales").innerHTML = `
    <div class="www-bar">
        <div class=""></div>
        <div class="social-mini">
            <a href="https://www.facebook.com/Soqualst" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>
            <!-- INSTAGRAM AUN NO FUNCIONAL -->
            <!-- <a href="#"><i class="fab fa-instagram"></i></a> -->
            <a href="https://wa.me/message/5BKFE4JXYKZRD1" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
        </div>
    </div>
  `;

});

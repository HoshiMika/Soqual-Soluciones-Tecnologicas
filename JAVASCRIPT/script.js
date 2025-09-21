 // Obtener referencias a los elementos del DOM
        const abrirModalBtn = document.getElementById('abrirModalBtn');
        const cerrarModalBtn = document.getElementById('cerrarModalBtn');
        const aceptarTerminosBtn = document.getElementById('aceptarTerminosBtn');
        const modalOverlay = document.getElementById('modalOverlay');
        const acceptTermsCheckbox = document.getElementById('acceptTerms');
        
        // Función para abrir el modal
        function abrirModal() {
            modalOverlay.classList.add('visible');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
        }
        
        // Función para cerrar el modal
        function cerrarModal() {
            modalOverlay.classList.remove('visible');
            document.body.style.overflow = ''; // Restaurar scroll del fondo
            acceptTermsCheckbox.checked = false;
            aceptarTerminosBtn.disabled = true;
        }
        
        // Función para redirigir al formulario de contacto
        function redirigirAContacto() {
            window.location.href = 'Contacto.html';
        }
        
        // Evento para abrir el modal al hacer clic en el botón
        abrirModalBtn.addEventListener('click', abrirModal);
        
        // Evento para cerrar el modal al hacer clic en el botón de cerrar
        cerrarModalBtn.addEventListener('click', cerrarModal);
        
        // Evento para aceptar términos y redirigir
        aceptarTerminosBtn.addEventListener('click', function() {
            if (acceptTermsCheckbox.checked) {
                cerrarModal();
                redirigirAContacto();
            }
        });
        
        // Evento para habilitar/deshabilitar el botón de aceptar
        acceptTermsCheckbox.addEventListener('change', function() {
            aceptarTerminosBtn.disabled = !this.checked;
        });
        
        // Evento para cerrar el modal al hacer clic fuera del contenido del modal
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay) {
                cerrarModal();
            }
        });
        
        // Evento para cerrar el modal con la tecla Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
                cerrarModal();
            }
        });
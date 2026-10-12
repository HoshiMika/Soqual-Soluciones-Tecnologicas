// Crear la sección principal de servicios detallados
document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("serviciosDetalle");

  if (!contenedor) {
    console.error("No se encontró el elemento con id='serviciosDetalle'");
    return;
  }

  contenedor.innerHTML = `
  <section class="services-detail">
  <div class="container">
    <h2 class="section-title">Servicios Detallados</h2>

    <!-- Soporte en Computadores -->
    <div class="service-detail-card">
      <div class="service-image">
        <i class="fas fa-laptop"></i>
      </div>
      <div class="service-content">
        <h3>Soporte Técnico en Computadores</h3>
        <p>Ofrecemos soluciones integrales para todo tipo de problemas relacionados con computadores, tanto en software como en hardware.</p>
        <ul class="service-features">
          <li><i class="fas fa-wrench"></i> Diagnóstico y reparación de problemas de hardware</li>
          <li><i class="fas fa-hdd"></i> Cambio de discos duros (HDD y SSD)</li>
          <li><i class="fas fa-desktop"></i> Reemplazo de pantallas y componentes dañados</li>
          <li><i class="fas fa-memory"></i> Ampliación de memoria RAM</li>
          <li><i class="fas fa-tools"></i> Mantenimiento preventivo y correctivo</li>
          <li><i class="fas fa-shield-virus"></i> Eliminación de virus y malware</li>
          <li><i class="fas fa-tachometer-alt"></i> Optimización del sistema operativo</li>
          <li><i class="fas fa-database"></i> Recuperación de datos</li>
        </ul>
      </div>
    </div>

    <!-- Soporte en Aplicaciones -->
    <div class="service-detail-card">
      <div class="service-image">
        <i class="fas fa-mobile-alt"></i>
      </div>
      <div class="service-content">
        <h3>Soporte en Aplicaciones</h3>
        <p>Brindamos asistencia especializada en la instalación, configuración y licenciamiento de las aplicaciones más utilizadas en el entorno profesional y personal.</p>
        <ul class="service-features">
          <li><i class="fas fa-check-circle"></i> Instalación y configuración de Microsoft Office</li>
          <li><i class="fas fa-check-circle"></i> Licenciamiento legal de software</li>
          <li><i class="fas fa-check-circle"></i> Instalación y configuración de AutoCAD</li>
          <li><i class="fas fa-check-circle"></i> Activación de Windows</li>
          <li><i class="fas fa-check-circle"></i> Instalación de software especializado</li>
          <li><i class="fas fa-check-circle"></i> Configuración de suites de productividad</li>
          <li><i class="fas fa-check-circle"></i> Solución de problemas de compatibilidad</li>
          <li><i class="fas fa-check-circle"></i> Asesoría en selección de software</li>
        </ul>
      </div>
    </div>

    <!-- Desarrollo Web -->
    <div class="service-detail-card">
      <div class="service-image">
        <i class="fas fa-code"></i>
      </div>
      <div class="service-content">
        <h3>Desarrollo de Páginas Web</h3>
        <p>Creación de sitios web personalizados según las necesidades específicas de cada cliente, con diseños modernos y funcionales.</p>
        <ul class="service-features">
          <li><i class="fas fa-check-circle"></i> Diseño web responsive (adaptable a dispositivos móviles)</li>
          <li><i class="fas fa-check-circle"></i> Desarrollo a medida según requerimientos del cliente</li>
          <li><i class="fas fa-check-circle"></i> Tiendas virtuales y comercio electrónico</li>
          <li><i class="fas fa-check-circle"></i> Landing pages para marketing</li>
          <li><i class="fas fa-check-circle"></i> Portales corporativos</li>
          <li><i class="fas fa-check-circle"></i> Blogs y sitios informativos</li>
          <li><i class="fas fa-check-circle"></i> Optimización para motores de búsqueda (SEO)</li>
          <li><i class="fas fa-check-circle"></i> Mantenimiento y actualización de sitios web</li>
        </ul>
      </div>
    </div>

    <!-- Cámaras de Seguridad -->
    <div class="service-detail-card">
      <div class="service-image">
        <i class="fas fa-video"></i>
      </div>
      <div class="service-content">
        <h3>Cámaras de Seguridad</h3>
        <p>Instalación y configuración de sistemas de videovigilancia para hogares y empresas, con tecnología de punta y monitoreo remoto.</p>
        <ul class="service-features">
          <li><i class="fas fa-check-circle"></i> Instalación de cámaras inalámbricas y alámbricas</li>
          <li><i class="fas fa-check-circle"></i> Configuración de aplicaciones móviles para monitoreo</li>
          <li><i class="fas fa-check-circle"></i> Sistemas de vigilancia con visión nocturna</li>
          <li><i class="fas fa-check-circle"></i> Cámaras con detección de movimiento</li>
          <li><i class="fas fa-check-circle"></i> Almacenamiento en la nube y local</li>
          <li><i class="fas fa-check-circle"></i> Sistemas con acceso remoto desde cualquier dispositivo</li>
          <li><i class="fas fa-check-circle"></i> Asesoría en diseño de sistemas de seguridad</li>
          <li><i class="fas fa-check-circle"></i> Mantenimiento y actualización de sistemas</li>
        </ul>
      </div>
    </div>
  </div>
  </section>
  `;
});

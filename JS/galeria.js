// galeria.js - Galería de trabajos: filtros por categoría y visor de fotos y videos
//
// CÓMO AGREGAR UNA FOTO O UN VIDEO
// 1) Copia el archivo en Imagenes/Galeria/fotos/ o en Imagenes/Galeria/videos/ (formato .mp4).
// 2) Agrega un objeto a GALERIA copiando uno de los ejemplos y cambia sus datos.
//    Categorías válidas: computadores, aplicaciones, desarrollo, cctv.
//    Para un video usa tipo: 'video' y agrega "poster" (la imagen de portada).
// 3) Guarda y recarga la página.
//
// Ejemplo de video:
//   {
//     tipo: 'video',
//     categoria: 'cctv',
//     titulo: 'Instalación de cámaras en local comercial',
//     descripcion: 'Montaje de 4 cámaras con grabación en la nube.',
//     src: '../Imagenes/Galeria/videos/instalacion-local.mp4',
//     poster: '../Imagenes/Galeria/fotos/instalacion-local.jpg',
//   },
const GALERIA = [
  {
    tipo: 'imagen',
    categoria: 'computadores',
    titulo: 'Mantenimiento de equipos de escritorio',
    descripcion: 'Diagnóstico, limpieza interna y optimización de rendimiento.',
    src: '../Imagenes/TecnicoComputadores.jpg',
  },
  {
    tipo: 'imagen',
    categoria: 'computadores',
    titulo: 'Soporte técnico presencial',
    descripcion: 'Reparación y mantenimiento correctivo en sitio.',
    src: '../Imagenes/Soporte.avif',
  },
  {
    tipo: 'imagen',
    categoria: 'aplicaciones',
    titulo: 'Instalación y configuración de software',
    descripcion: 'Licenciamiento e instalación de aplicaciones especializadas.',
    src: '../Imagenes/SoporteAplicaciones.avif',
  },
  {
    tipo: 'imagen',
    categoria: 'desarrollo',
    titulo: 'Desarrollo de páginas web',
    descripcion: 'Diseño y construcción de sitios web a la medida.',
    src: '../Imagenes/Desarrollo.avif',
  },
  {
    tipo: 'imagen',
    categoria: 'cctv',
    titulo: 'Instalación de cámaras de seguridad',
    descripcion: 'Montaje y configuración de sistemas de videovigilancia.',
    src: '../Imagenes/CCTV.avif',
  },
];

const grid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('gallery-lightbox');

if (grid && lightbox) {
  const media = lightbox.querySelector('.lightbox-media');
  const title = lightbox.querySelector('#lightbox-title');
  const caption = lightbox.querySelector('.lightbox-caption');
  const filters = document.querySelectorAll('[data-filter]');

  const openItem = (item) => {
    title.textContent = item.titulo;
    caption.textContent = item.descripcion;

    let el;
    if (item.tipo === 'video') {
      el = document.createElement('video');
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
      if (item.poster) el.poster = item.poster;
      el.src = item.src;
      el.addEventListener('error', () => {
        const aviso = document.createElement('p');
        aviso.className = 'lightbox-error';
        aviso.textContent = 'No se pudo cargar este video.';
        media.replaceChildren(aviso);
      });
    } else {
      el = new Image();
      el.src = item.src;
      el.alt = item.titulo;
    }
    media.replaceChildren(el);
    lightbox.showModal();
  };

  const createCard = (item) => {
    const li = document.createElement('li');
    li.className = 'card gallery-item';

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'gallery-open';
    open.setAttribute('aria-label', `${item.tipo === 'video' ? 'Ver video' : 'Ampliar foto'}: ${item.titulo}`);
    open.addEventListener('click', () => openItem(item));

    const img = new Image();
    img.src = item.poster || item.src;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    open.append(img);

    if (item.tipo === 'video') {
      const play = document.createElement('span');
      play.className = 'gallery-play';
      play.setAttribute('aria-hidden', 'true');
      play.innerHTML = '<i class="fas fa-play"></i>';
      open.append(play);
    }

    const body = document.createElement('div');
    body.className = 'gallery-caption';
    const h3 = document.createElement('h3');
    h3.textContent = item.titulo;
    const p = document.createElement('p');
    p.textContent = item.descripcion;
    body.append(h3, p);

    li.append(open, body);
    return li;
  };

  const render = (categoria) => {
    const items = GALERIA.filter((item) => categoria === 'todos' || item.categoria === categoria);
    if (!items.length) {
      const empty = document.createElement('li');
      empty.className = 'gallery-empty';
      empty.textContent = 'Pronto agregaremos trabajos de esta categoría.';
      grid.replaceChildren(empty);
      return;
    }
    grid.replaceChildren(...items.map(createCard));
  };

  filters.forEach((btn) =>
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      render(btn.dataset.filter);
    })
  );

  lightbox.querySelectorAll('[data-close-modal]').forEach((btn) =>
    btn.addEventListener('click', () => lightbox.close())
  );
  // Cerrar al hacer clic fuera del contenido
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
  // Al cerrar se quita el contenido para que el video deje de sonar
  lightbox.addEventListener('close', () => media.replaceChildren());

  render('todos');
}

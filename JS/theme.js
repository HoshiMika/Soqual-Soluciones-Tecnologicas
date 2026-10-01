// theme.js - Se carga en <head> (sin defer) para aplicar el tema antes de pintar y evitar destellos
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  try {
    var saved = localStorage.getItem('soqual-theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    root.dataset.theme = saved || (prefersLight ? 'light' : 'dark');
  } catch (e) {
    root.dataset.theme = 'dark';
  }
})();

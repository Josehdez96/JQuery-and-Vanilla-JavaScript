(async function loadData() {
  async function getData(url) {
    const res = await fetch(`https://yts.mx/api/v2${url}`);
    const response = await res.json();
    return response;
  }

  /* (Función para) Establecer atributos con Vanilla JavaScript */
  function setAttributes($element, attributes) {
    /* For que nos sirve para iterar sobre el total de elementos del OBJETO */
    for (const key in attributes) {
      $element.setAttribute(key, attributes[key]);
    }
  }

  /* Templates JS, HTML con datos dinamicos */
  function featuringTemplate(pelicula) {
    return `
    <div class="featuring">
      <div class="featuring-image">
        <img
          src="${pelicula.medium_cover_image}"
          width="70"
          height="100"
          alt=""
        />
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${pelicula.title}</p>
      </div>
    </div>
    `;
  }

  const $form = document.querySelector('#form');

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const $home = document.getElementById('home');
    $home.classList.add('search-active');

    /* Creación de un nuevo elemento HTML */
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      alt: 'loaderImg',
      height: '50px',
      width: '50px',
    });

    /* Contenedor de pelicula buscada */
    const $featuringContainer = document.querySelector('#featuring');

    /* append = adjuntar el $loader */
    $featuringContainer.append($loader);

    const parseData = new FormData($form);
    const {
      data: { movies: pelis },
    } = await getData(
      `/list_movies.json?/limit=1&query_term=${parseData.get('name')}`
    );

    const HTMLString = featuringTemplate(pelis[0]);
    /* innerHTML Convierte e inserta texto HTML en elementos del DOM reales de HTML */
    $featuringContainer.innerHTML = HTMLString;
  });

  /* Fetching de los diferentes generos */
  const actionList = await getData('/list_movies.json?genre=action');
  const dramaList = await getData('/list_movies.json?genre=drama');
  const animationList = await getData('/list_movies.json?genre=animation');

  /* Renderizar las peliculas de cada genero */
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList.data.movies, $actionContainer);

  const $dramaContainer = document.querySelector('#drama');
  renderMovieList(dramaList.data.movies, $dramaContainer);

  const $animationContainer = document.querySelector('#animation');
  renderMovieList(animationList.data.movies, $animationContainer);

  /* Templates JavaScript, HTML Dinamico */
  function videoItemTemplate(src, title) {
    return `
    <div class="primaryPlaylistItem">
    <div class="primaryPlaylistItem-image">
    <img src="${src}" />
    </div>
    <h4 class="primaryPlaylistItem-title">
    ${title}
    </h4>
    </div>
    `;
  }

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal();
    });
  }

  function renderMovieList(list, $container) {
    /* Remueve el icono de carga children[0] */
    $container.children[0].remove();

    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(
        movie.medium_cover_image,
        movie.title
      );
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement);
    });
  }

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const modalImage = $modal.querySelector('h1');
  const overlayImage = $overlay.querySelector('img');
  const hideModalImage = $hideModal.querySelector('p');

  /* Cambiando el CSS y añadiendo/removiendo la parte "active" de una class */
  function showModal() {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
  }

  $hideModal.addEventListener('click', hideModal);

  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  }
})();

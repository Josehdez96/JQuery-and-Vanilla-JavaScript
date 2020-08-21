(async function loadData() {
  async function getData(url) {
    const res = await fetch(`https://yts.mx/api/v2${url}`);
    const response = await res.json();
    if (response.data.movie_count > 0) {
      return response;
    }
    //Si no se cumple el if, continua con el código

    //Crear nuevo error con ||new Error|| y con ||throw||, lo lanzo
    throw new Error('No se encontró ningun resultado');
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

    //Validador de errores
    try {
      const {
        data: { movies: pelis },
      } = await getData(
        `/list_movies.json?/limit=1&query_term=${parseData.get('name')}`
      );

      const HTMLString = featuringTemplate(pelis[0]);
      /* innerHTML Convierte e inserta texto HTML en elementos del DOM reales de HTML */
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      alert(error);
      $loader.remove();
      $home.classList.remove('search-active');
    }
  });

  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      showModal($element);
    });
  }

  function renderMovieList(list, $container, category) {
    /* Remueve el icono de carga children[0] */
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      const image = movieElement.querySelector('img');
      image.addEventListener('load', (event) => {
        event.target.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    });
  }

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);

    /* Si no hay nada en cacheList devolverá ||null|| que es igual a ||false|| */
    if (cacheList) {
      /* Parseamos el texto que viene dentro de cacheList y lo convertimos en un objeto JSON */
      return JSON.parse(cacheList);
    }
    /* Fetching de datos */
    const {
      data: { movies: data },
    } = await getData(`/list_movies.json?genre=${category}`);

    /* Guardar en el localStorage */
    /* localStorage solo recibe texto, no objetos, por eso usamos JSON.stringify */
    window.localStorage.setItem(listName, JSON.stringify(data));
    return data;
  }

  const actionList = await cacheExist('action');
  /* Renderizar las peliculas de cada genero */
  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');

  const dramaList = await cacheExist('drama');
  const $dramaContainer = document.querySelector('#drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');

  const animationList = await cacheExist('animation');
  const $animationContainer = document.querySelector('#animation');
  renderMovieList(animationList, $animationContainer, 'animation');

  /* Templates JavaScript, HTML Dinamico */
  function videoItemTemplate(movie, category) {
    return `
    <div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}">
    <div class="primaryPlaylistItem-image">
    <img src="${movie.medium_cover_image}" />
    </div>
    <h4 class="primaryPlaylistItem-title">
    ${movie.title}
    </h4>
    </div>
    `;
  }

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalImage = $modal.querySelector('h1');
  const $overlayImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');

  function findById(list, id) {
    return list.find((movie) => movie.id === parseInt(id, 10));
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action':
        return findById(actionList, id);
      case 'drama':
        return findById(dramaList, id);
      default:
        return findById(animationList, id);
    }
  }

  /* Cambiando el CSS y añadiendo/removiendo la parte "active" de una class */
  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    /* Extraemos los datos del dataset establecido con data-id y data-category */
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const movieData = findMovie(id, category);
    $modalImage.textContent = movieData.title;
    $overlayImage.setAttribute('src', movieData.medium_cover_image);
    $modalDescription.textContent = movieData.description_full;
  }

  $hideModal.addEventListener('click', hideModal);

  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  }
})();

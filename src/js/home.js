// /* Composición basica Promesas */
// const getUser = new Promise(function (res, err) {
//   //Recibe una respuesta o un error
// })
// getUser
//   .then(res => res)
//   .catch(err => console.log(err))

// /* XMLHttpRequest con JQuery */
// $.ajax('https://yts.mx/api/v2/list_movies.json?genre=action', {
//   method: 'GET',
//   success: function (data) {
//     //Function tradicional
//     console.log(data);
//   },
//   error: (err) => {
//     //Arrow function
//     console.log(err);
//   },
// });

// /* Fetching PROMESAS con Vanilla JavaScript */
// fetch('https://randomuser.me/api/', {
//   method: 'GET',
// })
//   .then((response) => {
//     // console.log(response)
//     return response.json();
//   })
//   .then((data) => console.log('user', data))
//   .catch((err) => console.log('Hemos tenido un error', err));

/* Fetching ASYNC/AWAIT con Vanilla JavaScript */
(async function loadData() {
  async function getData(url) {
    const res = await fetch(
      `https://yts.mx/api/v2${url}` /* , {method: 'GET'} */
    );
    const response = await res.json();
    return response;
  }

  const actionList = await getData('/list_movies.json?genre=action');
  const dramaList = await getData('/list_movies.json?genre=drama');
  const animationList = await getData('/list_movies.json?genre=animation');
  // console.log(actionList, dramaList, animationList);

  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList.data.movies, $actionContainer);

  const $dramaContainer = document.querySelector('#drama');
  renderMovieList(dramaList.data.movies, $dramaContainer);

  const $animationContainer = document.querySelector('#animation');
  renderMovieList(animationList.data.movies, $animationContainer);

  /* Templates JavaScript */
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

  function renderMovieList(list, $container) {
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(
        movie.medium_cover_image,
        movie.title
      );
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
    });
  }

  const $featuringContainer = document.querySelector('#featuring');
  const $formContainer = document.querySelector('#form');
  const $homeContainer = document.querySelector('#home');

  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const modalImage = $modal.querySelector('h1');
  const overlayImage = $overlay.querySelector('img');
  const hideModalImage = $hideModal.querySelector('p');

  // /* Templates JQuery */
  // '<div class="primaryPlaylistItem">' +
  // '<div class="primaryPlaylistItem-image">' +
  // '<img src=' +
  // imageSRC +
  // ' />' + //Imagen dinamica
  //   '</div>' +
  //   '<h4 class="primaryPlaylistItem-title">' +
  //   'Titulo de la peli' +
  //   '</h4>' +
  //   '</div>';
})();

// /* Selector JQuery */
// const $HTMLtag = $.('HTMLtag')
// const $id = $.('#id')
// const $className = $.('.class')

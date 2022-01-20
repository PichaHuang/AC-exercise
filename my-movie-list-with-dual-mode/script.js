const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12
//新增: currentPage預設先給數字1, 之後如有點按paginator則會記錄當前頁數
let currentPage = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
//新增: dispalyMode DOM節點
const dispalyMode = document.querySelector('#display-mode')


axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(currentPage))
  })
  .catch((err) => console.log(err))


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})


searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
  if (filteredMovies.length === 0) {
    return alert(`沒有符合您輸入的關鍵字：${keyword} 的電影`)
  }
  renderPaginator(filteredMovies.length)
  //改這裡, 新增第49行, 搜尋完後把currentPage強制改為1, 在模式轉換時才能正確地從第一頁開始渲染
  currentPage = 1
  renderMovieList(getMoviesByPage(currentPage))
})


paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  //新增: 可共用的變數currentPage會隨著點按的頁數不同而跟著改變,進而抓到當前的正確資料來渲染
  currentPage = page
  renderMovieList(getMoviesByPage(currentPage))
})


//新增: 監聽模式轉換
dispalyMode.addEventListener('click', function onDisplayModeClicked(event) {
  if (event.target.matches('#card-mode-button')) {
    displayModeChange('card-mode')
    renderMovieList(getMoviesByPage(currentPage))
  } else if (event.target.matches('#list-mode-button')) {
    displayModeChange('list-mode')
    renderMovieList(getMoviesByPage(currentPage))
  }
})


function displayModeChange(displayMode) {
  if (dataPanel.dataset.mode === displayMode) return
  dataPanel.dataset.mode = displayMode
}


function renderMovieList(data) {
  //新增: 判斷 card-mode 或是 list-mode
  if (dataPanel.dataset.mode === 'card-mode') {
    let rawHTML = ''
    data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>`
    })
    dataPanel.innerHTML = rawHTML
    } else if (dataPanel.dataset.mode === 'list-mode') {
    //新增: ul開頭標籤, forEach <li>標籤, ul結尾標籤, 塞進dataPanel
    let rawHTML = `<ul class="list-group list-group-flush">`
    data.forEach((item) =>{
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between">
        <h5 class="list-title">${item.title}</h5>
        <div class="list-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>
      `
    })
    rawHTML += `</ul>`
    dataPanel.innerHTML = rawHTML
  }
}


function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"> <a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}
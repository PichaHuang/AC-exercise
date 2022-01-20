const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
let filteredUsers = []
const USERS_PER_PAGE = 16

const dataPanel = document.querySelector('#users')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
  })
  .catch((err) => console.log(err))

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  //取消預設事件
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //儲存符合篩選條件的項目
  filteredUsers = users.filter((user) => user.email.toLowerCase().includes(keyword))
  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }
  //重新輸出至畫面
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

function renderUserList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${item.avatar}" class="card-img-top" alt="User Poster">
          <div class="card-body">
            <h5 class="card-title">${item.name} ${item.surname}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-user" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    </div>  
    `
    dataPanel.innerHTML = rawHTML
  })
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"> <a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function showUserModal(id) {
  const modalTitle = document.querySelector('#user-modal-title')
  const modalImage = document.querySelector('#user-modal-image')
  const modalDate = document.querySelector('#user-modal-date')
  const modalEmail = document.querySelector('#user-modal-email')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = `${data.name} ${data.surname}`
    modalDate.innerText = 'Birthday: ' + data.birthday
    modalEmail.innerText = data.email
    modalImage.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('此使用者已經在喜愛清單中！')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}
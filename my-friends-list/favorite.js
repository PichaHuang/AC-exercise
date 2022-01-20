const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = JSON.parse(localStorage.getItem('favoriteUsers')) || []
let filteredUsers = []
const USERS_PER_PAGE = 16

const dataPanel = document.querySelector('#users')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')


renderPaginator(users.length)
renderUserList(getUsersByPage(1))


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    showUserModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})


function removeFromFavorite(id) {
  if (!users || !users.length) return
  //透過 id 找到要刪除好友的 index
  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex === -1) return
  //刪除該筆好友
  users.splice(userIndex, 1)
  //存回 local storage
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  //更新頁面
  renderUserList(users)

}


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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
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

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}
// 初始變數
const list = document.querySelector('#my-todo')
const addBtn = document.querySelector('#add-btn')
const input = document.querySelector('#new-todo')
const workingArea = document.querySelector('#working-area')
const done = document.querySelector('#my-done')

// 資料
const todos = ['Hit the gym', 'Read a book', 'Buy eggs', 'Organize office', 'Pay bills']
for (let todo of todos) {
  addItem(todo)
}

// 函式
function addItem (text) { 
    let newItem = document.createElement('li')
    newItem.innerHTML = `
      <label for="todo">${text}</label>
      <i class="delete fa fa-trash"></i>
    `
    list.appendChild(newItem)
}

// write your code here
addBtn.addEventListener('click', function() {
  let inputValue = input.value.trim()  //去除字串前後的空白
  if (inputValue.length > 0) {
    addItem(inputValue)
  }
})

//輸入框裡按下 Enter 鍵時，可以新增 to-do
input.addEventListener('keypress', function(event) {
  if (event.key === "Enter") {
    let inputValue = input.value.trim()
    if (inputValue.length > 0) {
      addItem(inputValue)
    }
  }
})

workingArea.addEventListener('click', function(event) {
  let target = event.target 
  if (target.classList.contains('delete')) {
    let parentElement = target.parentElement
    parentElement.remove()
  }
})

list.addEventListener('click', function(event) {
  let target = event.target 
  if (target.tagName === 'LABEL') {
    target.classList.toggle('checked')
    done.appendChild(target.parentElement)  //送進 Done 清單
  }
})
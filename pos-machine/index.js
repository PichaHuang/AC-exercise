// ======= default data =======
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const button = document.querySelector("#submit-button");

// 菜單資料
const productData = [
  {
    id: "product-1",
    imgUrl:
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "馬卡龍",
    price: 90
  },
  {
    id: "product-2",
    imgUrl:
      "https://images.unsplash.com/photo-1560691023-ca1f295a5173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "草莓",
    price: 60
  },
  {
    id: "product-3",
    imgUrl:
      "https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "奶茶",
    price: 100
  },
  {
    id: "product-4",
    imgUrl:
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "冰咖啡",
    price: 180
  }
];
// ======= 請從這裡開始 =======
//1.使用菜單資料,產生menu區塊
let producthtml = ``
productData.forEach(function (product) {
  producthtml += `
    <div class="col-3">
      <div class="card">
         <img src="${product.imgUrl}" class="card-img-top" alt="...">
         <div class="card-body">
           <h5 class="card-title">${product.name}</h5>
           <p class="card-text">${product.price}</p>
           <a href="#" class="btn btn-primary">加入購物車</a>
         </div>
       </div>
     </div>
  `
})
menu.innerHTML = producthtml

//2.加入購物車
menu.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn')) {
    let buyList = document.createElement('li')
    buyList.classList.add('list-group-item')
    let productName = e.target.parentElement.children[0].innerText
    let productPrice = e.target.parentElement.children[1].innerText
    buyList.textContent = `${productName} X 1 小計：${productPrice}`
    cart.appendChild(buyList)

    //3.購物車金額加總
    let money = totalAmount.textContent
    if (money === '--') {
      money = 0
    } else {
      money = Number(money)
    }
    totalAmount.textContent = money + Number(productPrice)
  }
})

//4.送出訂單,跳出收據,購物車被清空
button.addEventListener('click', function () {
  const message = `
    感謝購買
    總金額 = ${totalAmount.textContent}
  `
  alert(message)
  cart.innerHTML = ''
  totalAmount.textContent = '--'
})

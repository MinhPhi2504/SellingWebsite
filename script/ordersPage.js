import { orders, HashTable } from "../data/orders.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
import {updateCartQuantity, cart, saveDataCart, saveDataQuantity, count_Quantity, check_exist} from "../data/cart.js"
/*console.log(products)
console.log(orders)
console.log(orders.length)*/
function renderOrderGrid () {
let html = ''
    orders.forEach((order) => { 
    const dateString = order.orderTime;
    const formattedDate = dayjs(dateString).format('MMMM DD YYYY');
    html += `
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${formattedDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${(order.totalCostCents/100).toFixed(2)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
               <div>Order ID: ${order.id}</div>
            </div>
          </div>
          ${
            showListProduct(order)
          }  
    `
    })
    document.querySelector('.js-order-container').innerHTML = html
}
if (orders.length != 0)
  renderOrderGrid()
function showListProduct(order) {
  let html = ''
  order.products.forEach((product) => {
    const productId = product.productId
    let matchingProduct
    products.forEach((item) => {
        if (item.id === productId)
            matchingProduct = item
    })
    const dateString = product.estimatedDeliveryTime
    const formattedDate = dayjs(dateString).format('MMMM DD YYYY');
    html += `
        <div class="order-details-grid">
        <div class="product-image-container">
        <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
        <div class="product-name">
            ${matchingProduct.name}
        </div>
        <div class="product-delivery-date">
            Arriving on: ${formattedDate}
        </div>
        <div class="product-quantity">
            Quantity: ${product.quantity}
        </div>
        <button class="buy-again-button button-primary">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message js-buy-again-message"
            data-product-id = "${productId}"
            data-order-id = "${order.id}">Buy it again</span>
        </button>
        <div class='added-to-cart js-added-to-cart-${productId}-${order.id}'  >
              <img src="images/icons/checkmark.png">
              Added
            </div>
        </div>

        <div class="product-actions">
        <a href='tracking.html?orderId=${order.id}&productId=${productId}'>
            <button class="track-package-button button-secondary">
            Track package
            </button>
        </a>
        </div>
    </div>    
    `
})
    return html
}

const H = new HashTable()
H.setOrders(orders, orders.length)


document.querySelectorAll('.js-buy-again-message').forEach((item) => {
  item.addEventListener('click', () => {
    const {productId, orderId} = item.dataset
    let matchingOrder = H.getOrderFromOrderId(orderId)
    if (matchingOrder != '') {
      let matchingProduct = ''
      matchingOrder.products.forEach((product) => {
        if (product.productId === productId) // productId -> product
          matchingProduct = product
      }) 
      const check = check_exist(productId,cart)
      if (check != '') {
        check.quantity += Number(matchingProduct.quantity)
      }
      else {
        cart.push({
          productId : productId,
          quantity : Number(matchingProduct.quantity),
          deliveryOptionId : '1'
        })
      }
      /*console.log(productId)
      console.log(orderId)
      console.log(`js-added-to-cart-${productId}-${orderId}`)*/
      const message = document.querySelector(`.js-added-to-cart-${productId}-${orderId}`)
      console.log(`added ${productId}` )
      message.style.opacity = 1
      setTimeout(() => {
        message.style.opacity = 0
      },5000)
      saveDataCart()
      const cartQuantity = count_Quantity()
      saveDataQuantity(cartQuantity)
      updateCartQuantity()
    }
  })
})
updateCartQuantity()

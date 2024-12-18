import { loadProductsFetch, products } from "./products.js"
export let cart = JSON.parse(localStorage.getItem('cart')) || []
export function removeFromCart (productId) {
    let newCart = []
    cart.forEach ((cartItem) => {
        if ( cartItem.productId != productId)
            newCart.push(cartItem)
    })
    cart = newCart
}
export function saveDataCart () {
    localStorage.setItem ('cart', JSON.stringify(cart))
}
export function saveDataQuantity (quantity) {
    localStorage.setItem ('quantity', JSON.stringify(quantity))
}
export function count_Quantity () {
    let countQuantity = 0
    cart.forEach((item) => {
      countQuantity += item.quantity
    })
    return countQuantity
} 
export function getProductFromId (productId) {
    let findProductWithId
    cart.forEach((item) => {
        if (item.productId === productId)
            findProductWithId = item
    })
    return findProductWithId
}
export function updateCartQuantity () {
    let total = Number(JSON.parse(localStorage.getItem('quantity')))
    if (!total)
      total = 0
    document.querySelector('.js-cart-quantity').innerHTML = total
}
export function updateDeliveryOptionForCart (productId, deliveryOption) {
    let matchingProduct
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId)
            matchingProduct = cartItem
    })
    matchingProduct.deliveryOptionId = deliveryOption
}
export function calculateTotalPriceProducts () {
    let sum = 0
    let matchingProduct
    cart.forEach((cartItem) => {
        products.forEach((product) =>{
            if (cartItem.productId === product.id) {
                matchingProduct = product
            }
        })
        sum += cartItem.quantity * matchingProduct.priceCents
    })
    return sum
}
export function calculateTotalPriceDelivery () {
    let sum = 0
    cart.forEach((cartItem) => {
        if ( Number(cartItem.deliveryOptionId) === 2 ) {
            sum += 499
        }
        else if ( Number(cartItem.deliveryOptionId) === 3 ) {
            sum += 999
        }
    }
        )
        return sum
    }
export function renderProducsGrid(array){
    let html = ''
    array.forEach ( (product) => {
        html += ` 
            <div class="product-container">
                <div class="product-image-container">
                <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                ${product.name}
                </div>

                <div class="product-rating-container">
                <img class="product-rating-stars"
                    src="images/ratings/rating-${product.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                ${product.rating.count * 10}
                </div>
                </div>

                <div class="product-price">
                $${(product.priceCents / 100).toFixed(2)}
                </div>

                <div class="product-quantity-container">
                <select class = "js-select-option-${product.id}">
                    <option selected value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                </div>
                ${product.extraInfoHTML()}
                <div class="product-spacer"></div>

                <div class='added-to-cart js-added-to-cart-${product.id}'  >
                <img src="images/icons/checkmark.png">
                Added
                </div>

                <button class="add-to-cart-button button-primary js-add-to-cart"
                data-product-id = "${product.id}">
                Add to Cart
                </button>
            </div>
            `
    })
    document.querySelector('.js-products-grid').innerHTML = html


    function addToCart (button) {
        const productId = button.dataset.productId
        const getQuantity = document.querySelector(`.js-select-option-${productId}`)
        const check = check_exist(productId,cart)
        if (check != '') {
            check.quantity += Number(getQuantity.value)
        }
        else {
            cart.push({
            productId : productId,
            quantity : Number(getQuantity.value),
            deliveryOptionId : '1'
            })
        }
        saveDataCart()
        
    }
    document.querySelectorAll('.js-add-to-cart').forEach( (button) => {
        button.addEventListener('click', () => { 
        addToCart(button) 
        const productId = button.dataset.productId
        const message = document.querySelector(`.js-added-to-cart-${productId}`)
        message.style.opacity = 1
        setTimeout(() => {
            message.style.opacity = 0
        },5000)
        const countQuantity = count_Quantity ()
        saveDataQuantity(countQuantity)
        updateCartQuantity()
        })
    })
    }
export function check_exist (productId, cart ) {
    let product = ''
    for ( let i = 0; i < cart.length; i++ ) {
      if (productId === cart[i].productId) {
        product = cart[i]
        break;
      }
    }
    return product
  }

export function searchProduct (array) {
    let productSearchList = []
    document.querySelector('.js-search-button').addEventListener('click', () => {
        let valueInput = document.querySelector('.js-search-bar').value
        productSearchList = array.filter(value => {
            return value.name.toUpperCase().includes(valueInput.toUpperCase())
        })
        renderProducsGrid(productSearchList)
    })
}
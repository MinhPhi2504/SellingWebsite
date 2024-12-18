import { cart, saveDataCart, saveDataQuantity, count_Quantity, updateCartQuantity, updateDeliveryOptionForCart, calculateTotalPriceProducts,
    calculateTotalPriceDelivery
 } from "../data/cart.js"
import { loadProducts, products, loadProductsFetch, saveProducts } from "../data/products.js"
import { removeFromCart, getProductFromId } from "../data/cart.js"
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
import { deliveryOptions } from "../data/deliveryOptions.js"
import {addOrder} from "../data/orders.js"
let total = Number(JSON.parse(localStorage.getItem('quantity')))
    if (!total)
      total = 0
    document.querySelector('.js-return-to-home-link').innerHTML = `${total} items`
/*new Promise ((resolve) => {
    loadProducts(resolve)
}).then(() => {
    renderCheckoutHTML()
})*/
async function loadPageCheckout() {
    console.log('load data products')
    await loadProductsFetch()
}
loadPageCheckout().then(() => {
    renderCheckoutHTML()
    console.log('load success')
    console.log(products)
    console.log(cart)
})
function renderCheckoutHTML () {
    Show_summary()
    let checkoutHTML = ``
    cart.forEach((cartItem) => { // cart chỉ lưu id và số lượng nên cần duyệt 2 lần
        const productId = cartItem.productId
        let findProductWithId
        products.forEach((item) => {
            if (productId === item.id) {
                findProductWithId = item
            }
        })
        let deliveryOption

        deliveryOptions.forEach ((option) => {
            if (cartItem.deliveryOptionId === option.id) {
                deliveryOption = option
            }
        })

        const today = dayjs()
        const deliveryDay = today.add(`${deliveryOption.deliveryDays}`, 'days')
        const dateString = deliveryDay.format('dddd, MMMM D')

        checkoutHTML += `
        <div class="cart-item-container js-cart-item-container-${cartItem.productId}">
            <div class="delivery-date">
                Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${findProductWithId.image}">

                <div class="cart-item-details">
                    <div class="product-name">
                        ${findProductWithId.name}
                    </div>
                    <div class="product-price">
                        ${(findProductWithId.priceCents / 100 ).toFixed(2)}
                    </div>
                    <div class="product-quantity js-product-quantity">
                        <span>
                        Quantity: <span class="quantity-label js-quantity-label-${cartItem.productId}">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary js-update-quantity-link
                            js-update-quantity-link-${cartItem.productId}"
                        data-product-id = "${cartItem.productId}">Update</span>
                        <span class="delete-quantity-link link-primary 
                            js-delete-link" data-product-id = "${cartItem.productId}">
                        Delete
                        </span>
                    </div>
                </div>

                <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    ${deliveryOptionHTML(cartItem)} 
                </div>
            </div>
        </div>
            `;
})
    document.querySelector('.order-summary').innerHTML = checkoutHTML

    document.querySelectorAll('.js-delivery-option').forEach((option) =>{
        option.addEventListener('click', () => {
            const productId = option.dataset.productId
            const selectedRadio = document.querySelector(`input[name="delivery-option-${productId}"]:checked`);
            const selectedValue = selectedRadio.value; // Lấy giá trị của radio
            let matchingProduct = ''
            cart.forEach((item) => {
                if(productId === item.productId)
                    matchingProduct = item
            })
            matchingProduct.deliveryOptionId = selectedValue
        })
    })
    

    document.querySelectorAll('.js-delete-link').forEach ( (link) => {//delete
        link.addEventListener('click', () => {
        const productId = link.dataset.productId
        removeFromCart(productId)
        const container = document.querySelector(`.js-cart-item-container-${productId}`)
        container.remove()
        saveDataCart()
        total = count_Quantity()
        saveDataQuantity(total)
        document.querySelector('.js-return-to-home-link').innerHTML = `${total} items`
        Show_summary()
        renderCheckoutHTML()
        })
    })
    document.querySelectorAll('.js-update-quantity-link').forEach ((link) => {
        link.addEventListener('click', () => { 
            const productId = link.dataset.productId
            let update = document.querySelector(`.js-update-quantity-link-${productId}`)
            if ( update.innerHTML === "Update") { //update
                document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `
                    <input class = "input-quantity js-input-quantity-${productId}"> </input>
                `
                const inputElement = document.querySelector(`.js-quantity-label-${productId}`)
                inputElement.addEventListener('keydown', (event) => {
                    if(event.key === 'Enter'){
                        Save(productId)
                    }
                })
                document.querySelector(`.js-update-quantity-link-${productId}`).innerHTML = 'Save'
            }
            else {//Save
            Save(productId)
            }
        })
    })

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset
            updateDeliveryOptionForCart(productId, deliveryOptionId)
            Show_summary ()
            renderCheckoutHTML()
        })
    })
}

function deliveryOptionHTML(cartItem) {
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs()
        const deliveryDay = today.add(`${deliveryOption.deliveryDays}`, 'days')
        const dateString = deliveryDay.format('dddd, MMMM D')
        const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `${(deliveryOption.priceCents/100).toFixed(2)} -`
        const ischecked = cartItem.deliveryOptionId === deliveryOption.id
        html +=
        `
        <div class="delivery-option js-delivery-option"
        data-product-id = "${cartItem.productId}"
        data-delivery-option-id = "${deliveryOption.id}">
            <input type="radio" ${ischecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${cartItem.productId}"
                value="${deliveryOption.id}">
            <div>
                <div class="delivery-option-date">
                    ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString} Shipping
                </div>
            </div>
        </div>
        `
    })
    return html
}


function Save(productId) {
    const item = getProductFromId(productId)
    const inputElement = document.querySelector(`.js-input-quantity-${productId}`)
    item.quantity = Number(inputElement.value)
    document.querySelector(`.js-quantity-label-${productId}`).innerHTML = `${item.quantity}`
    document.querySelector(`.js-update-quantity-link-${productId}`).innerHTML = 'Update'
    saveDataCart()
    total = count_Quantity()
    saveDataQuantity(total)
    document.querySelector('.js-return-to-home-link').innerHTML = `${total} items`
    Show_summary()
    renderCheckoutHTML()    
}

function Show_summary () {
    const totalPriceProducts = Number(calculateTotalPriceProducts())
    const totalPriceDelivery = Number(calculateTotalPriceDelivery())
    let payment_summary_html =
        `
        <div class="payment-summary-title">
            Order Summary
            </div>

            <div class="payment-summary-row">
                <div>Items (${total}):</div>
                <div class="payment-summary-money">$${(totalPriceProducts/100).toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Shipping &amp; handling:</div>
                <div class="payment-summary-money">$${(totalPriceDelivery/100).toFixed(2)}</div>
            </div>

            <div class="payment-summary-row subtotal-row">
                <div>Total before tax:</div>
                <div class="payment-summary-money">$${((totalPriceProducts + totalPriceDelivery)/100).toFixed(2)}</div>
            </div>

            <div class="payment-summary-row">
                <div>Estimated tax (10%):</div>
                <div class="payment-summary-money">$${(((totalPriceProducts + totalPriceDelivery)/100)*0.1).toFixed(2)}</div>
            </div>

            <div class="payment-summary-row total-row">
                <div>Order total:</div>
                <div class="payment-summary-money">$${(((totalPriceProducts + totalPriceDelivery)* 0.001) + (totalPriceProducts + totalPriceDelivery)/100).toFixed(2)}</div>
            </div>

            <button class="place-order-button button-primary js-place-order">
                Place your order
            </button>
        `
        document.querySelector('.js-payment-summary').innerHTML = payment_summary_html
        sendDataToBackEnd()
}
function sendDataToBackEnd () {
    document.querySelector('.js-place-order').addEventListener('click', async () => {   
        if (cart.length === 0) 
            window.location.href = 'orders.html'
        else 
        {
            try{
                const response = await fetch('https://supersimplebackend.dev/orders', {
                    method: 'POST', 
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        cart: cart
                    })
                })
                const order = await response.json()
                addOrder(order)
                cart.length = 0 
                saveDataCart() 
                saveDataQuantity(0)
                saveProducts() 
                window.location.href = 'orders.html'
            } catch (error) {
                console.log ('Unexpected Error. Please try again.')
                console.log(error)
            }
        }
    })
}